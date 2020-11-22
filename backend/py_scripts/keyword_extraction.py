#!/usr/bin/env python

import numpy as np
import itertools
import json
import collections
import sys

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer, util
from youtube_transcript_api import YouTubeTranscriptApi
from sklearn.feature_extraction.text import TfidfVectorizer
from rake_nltk import Rake, Metric


def is_in_range(segment, time_low, time_high):
    segment_low = segment['start']
    segment_high = segment['start'] + segment['duration']
    
    if time_low <= segment_low <= time_high or time_low <= segment_high <= time_high:
        return True
    
    return False

def get_caption_segment(video_id, timestamp, duration, delta=15, concat_sentences=False):
    raw_transcript = YouTubeTranscriptApi.get_transcript(video_id)
    
    low_timestamp = max(timestamp - delta, 0)
    high_timestamp = min(timestamp + delta, duration)
    
    # Get rid of music
    filtered_transcript = list(filter(lambda e: e['text'] != '[Music]', raw_transcript))
    target_segment = filter(lambda e: is_in_range(e, low_timestamp, high_timestamp), filtered_transcript)
    text_segments = list(map(lambda e: e['text'], list(target_segment)))
    
    if concat_sentences:
        return " ".join(text_segments)
    
    return text_segments

# Parameters to tune
# https://pypi.org/project/rake-nltk/
def extract_keywords_with_rake(sentences, stopwords=None, print_time=True, period_split=False, ranking_metric=Metric.WORD_DEGREE):
    rake = None
    if stopwords is not None:
        rake = Rake(stopwords=stopwords, ranking_metric=ranking_metric)
    else:
        rake = Rake(ranking_metric=ranking_metric)
    
    if period_split:
        rake.extract_keywords_from_text(". ".join(sentences))
    else:
        rake.extract_keywords_from_text(" ".join(sentences))

    return rake.get_ranked_phrases()[:4]

def extract_keywords_with_bert(
    sentences, n_gram=(1,1),
    use_stop_words=True,
    model_name='distilbert-base-nli-mean-tokens'
):
    n_gram_range = n_gram

    stop_words = []
    if use_stop_words:
        stop_words = 'english'

    # Extract candidate words/phrases
    count = CountVectorizer(
        ngram_range=n_gram_range,
        stop_words=stop_words).fit([". ".join(sentences)])
    candidates = count.get_feature_names()

    # Encode sentences and candidate phrases
    model = SentenceTransformer(model_name)
    doc_embedding = model.encode([". ".join(sentences)], convert_to_tensor=True)
    candidate_embeddings = model.encode(candidates, convert_to_tensor=True)

    # Compute Similarity via cos
    cosine_scores = util.pytorch_cos_sim(doc_embedding, candidate_embeddings)

    keywords = [candidates[index] for index in cosine_scores.argsort()[0][-5:]]
    return keywords[:5]


if __name__ == "__main__":
    # Usage python keyword_extraction.py <Video ID> <Timestamp>

    # Retrieve captions
    segment_sentences = get_caption_segment(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]))
    # Extract keywords with Rake
    rake_keywords = extract_keywords_with_rake(segment_sentences)

    # Extract keywords with Bert
    bert_keywords = extract_keywords_with_bert(
        segment_sentences, n_gram=(1, 3), use_stop_words=False)

    print(json.dumps({
        "rake": rake_keywords,
        "bert": bert_keywords
    }))
