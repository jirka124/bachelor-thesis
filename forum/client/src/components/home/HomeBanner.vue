<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeBanner",
});
</script>

<template>
  <div id="home-banner">
    <div id="home-banner-bg">
      <picture id="home-banner-bg-pic">
        <source type="image/webp" srcset="@/assets/banner-moving-back-512.webp" media="(max-width: 512px)" width="512"
          height="341" />
        <source type="image/jpeg" srcset="@/assets/banner-moving-back-512.jpg" media="(max-width: 512px)" width="512"
          height="341" />
        <source type="image/webp" srcset="@/assets/banner-moving-back-768.webp" media="(max-width: 768px)" width="768"
          height="512" />
        <source type="image/jpeg" srcset="@/assets/banner-moving-back-768.jpg" media="(max-width: 768px)" width="768"
          height="512" />
        <source type="image/webp" srcset="@/assets/banner-moving-back-1024.webp" width="1024" height="683" />
        <source type="image/jpeg" srcset="@/assets/banner-moving-back-1024.jpg" width="1024" height="683" />
        <img id="home-banner-bg-img" src="@/assets/banner-moving-back-768.jpg" alt="abstract background" width="768"
          height="512" fetchpriority="high" />
      </picture>
    </div>
    <picture id="home-banner-bot-pic">
      <source type="image/webp" srcset="@/assets/thinking-bot-256.webp" media="(max-width: 768px)" width="256"
        height="256" />
      <source type="image/png" srcset="@/assets/thinking-bot-256.png" media="(max-width: 768px)" width="256"
        height="256" />
      <source type="image/webp" srcset="@/assets/thinking-bot-400.webp" width="400" height="400" />
      <source type="image/png" srcset="@/assets/thinking-bot-400.png" width="400" height="400" />
      <img id="home-banner-bot-img" src="@/assets/thinking-bot-400.png" alt="robot illustration" width="400"
        height="400" loading="lazy" />
    </picture>
    <div id="home-banner-caption">
      <b>Find your answer before asking a thing!</b>
      <p>The biggest world known discussion forum</p>
      <picture id="home-banner-catiption-pic">
        <source type="image/webp" srcset="@/assets/identity/icon/icon-256.webp" width="256" height="256" />
        <source type="image/png" srcset="@/assets/identity/icon/icon-256.png" width="256" height="256" />
        <img src="@/assets/identity/icon/icon-256.png" alt="company icon" width="256" height="256" loading="lazy" />
      </picture>
    </div>
  </div>
</template>

<style scoped>
#home-banner {
  position: relative;
  width: 100%;
  height: calc(100vh - calc(60px + 4vh));
  border-radius: 16px;
  overflow: hidden;
}

#home-banner-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: calc(100% + 10vw);
  height: calc(100% + 10vh);
  animation: trianglePath 10s cubic-bezier(0.5, 0.1, 0.9, 0.5) infinite;
}

#home-banner-bg-pic {
  width: 100%;
  height: 100%;
}

#home-banner-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#home-banner-bot-pic {
  position: absolute;
  left: -80px;
  bottom: 0;
}

#home-banner-bot-img {
  display: block;
  height: 400px;
  width: 400px;
}

#home-banner-caption {
  text-align: right;
  position: absolute;
  bottom: 6vh;
  right: 4vw;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  width: 500px;
  height: 120px;
  padding: 8px 12px;
  border-radius: 16px;
  background-color: white;
  background: linear-gradient(90deg, rgba(234, 127, 57, 1) 0% 0%, rgba(255, 255, 255, 1) 20.04% 20.04%, rgba(255, 255, 255, 1) 100% 100%);
  box-shadow: 0px 2px 8px 8px rgba(234, 127, 57, 0.8);
}

#home-banner-caption>b {
  font-size: 22px;
  color: #EA7F39;
}

#home-banner-caption>p {
  font-size: 18px;
  color: #64BFB5;
  font-weight: bold;
}

#home-banner-catiption-pic {
  position: absolute;
  left: 0;
  bottom: 50%;
  width: 190px;
  transform: translate(-50%, 50%);
}

#home-banner-catiption-pic>img {
  width: 100%;
}

@keyframes trianglePath {

  0%,
  100% {
    transform: translate(calc(-50% - 2.5vw), calc(-50% - 2.5vh));
  }

  33% {
    transform: translate(calc(-50% + 2.5vw), calc(-50% - 2.5vh));
  }

  66% {
    transform: translate(calc(-50% - 2.5vw), calc(-50% + 2.5vh));
  }
}

@media only screen and (max-width: 768px) {
  #home-banner-caption {
    text-align: center;
    align-items: center;
    row-gap: 8px;
    bottom: 50%;
    right: 50%;
    width: 300px;
    height: auto;
    padding: 8px 12px 160px;
    background: none;
    background-color: white;
    transform: translate(50%, 50%);
  }

  #home-banner-caption>b {
    font-size: 26px;
  }

  #home-banner-catiption-pic {
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 50%);
  }

  #home-banner-bot-pic {
    z-index: 2;
    left: -50px;
  }

  #home-banner-bot-img {
    height: 256px;
    width: 256px;
  }
}
</style>
