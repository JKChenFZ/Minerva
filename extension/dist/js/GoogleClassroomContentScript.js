(()=>{"use strict";let e={player:null,video:null};window.addEventListener("click",(function t(o){console.log("Detected a click");let n=o.target;if("A"===n.nodeName){let d=n.getAttribute("href");if(d.includes("youtube")){o.preventDefault(),console.log("Stopped redirection to Youtube"),window.removeEventListener("click",t);let n=document.createElement("div");n.id="studyModeLocker",n.addEventListener("click",(e=>{e.stopPropagation(),console.log("Overlay clicked")})),document.getElementsByTagName("BODY")[0].appendChild(n),function(t){let o=document.getElementById("studyModeLocker");console.log(t);let n=document.createElement("DIV"),d=document.createElement("BUTTON"),i=document.createElement("I"),a=document.createElement("BUTTON"),l=document.createElement("I");i.setAttribute("class","fas fa-times-circle icon-left-padding"),d.setAttribute("class","button exit-button"),d.innerText="Leave",d.addEventListener("click",(e=>function(e,t){e.stopPropagation();let o=document.getElementById("studyModeLocker");o&&(o.remove(),window.addEventListener("click",t))}(e,t))),l.setAttribute("class","fas fa-question icon-left-padding"),a.setAttribute("class","button question-button"),a.innerText="Question",a.addEventListener("click",(t=>async function(t){t.stopPropagation(),console.debug("Question ButtonPressed at "+e.player.getCurrentTime())}(t))),d.appendChild(i),a.appendChild(l),n.setAttribute("class","button-container"),n.appendChild(d),n.appendChild(a),o.appendChild(n)}(t),function(t){let o=document.getElementById("studyModeLocker"),n=t.split("youtube.com/watch?v="),d="hXDiv7f73H0";d=2==n.length?n[1]:n[0];let i=document.createElement("div"),a=document.createElement("iframe");i.id="videoWrapper",a.id="videoIFrame",a.origin="youtube.com",a.setAttribute("width","100%"),a.setAttribute("height","100%"),a.setAttribute("class","youtubeIFrame"),a.src=`https://www.youtube-nocookie.com/embed/${d}?enablejsapi=1&controls=0`,i.appendChild(a),o.appendChild(i),e.player=new YT.Player("videoIFrame",{events:{onReady:e=>{console.debug("Embedded Youtube Player is ready"),window.localStorage.setItem("youtube_video_id",d),window.localStorage.setItem("youtube_video_duration",e.target.getDuration()),window.localStorage.setItem("youtube_video_title",e.target.getVideoData().title)},onStateChange:e=>{console.debug("Embedded Youtube Player has a new change"),e.data,YT.PlayerState.ENDED}}})}(d),async function(){!function(){let e=document.createElement("VIDEO");e.id="overlayVideoCam",e.setAttribute("autoplay","");let t=document.createElement("CANVAS");t.id="overlayVideoCanvas",t.width=640,t.height=480;let o=document.getElementById("studyModeLocker");o.appendChild(e),o.appendChild(t)}(),await async function(){return e.video=document.getElementById("overlayVideoCam"),e.stream=await navigator.mediaDevices.getUserMedia({audio:!1,video:{facingMode:"user"}}),e.video.srcObject=e.stream,new Promise((t=>{e.video.onloadedmetadata=()=>{t(e.video)}}))}()}()}}})),console.log("Google Classroom Overlay registered")})();