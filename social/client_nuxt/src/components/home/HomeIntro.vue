<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeIntro",
});
</script>

<template>
  <div id="intro">
    <div id="intro-points">
      <h2>What is SoConnect?</h2>
      <div class="intro-point">
        <div>1</div>
        <p>SoConnect is a cutting-edge social media platform that empowers people to connect, share, and engage with their
          communities and the world.</p>
      </div>
      <div class="intro-point">
        <div>2</div>
        <p>We provide a dynamic and user-friendly space for meaningful conversations, content sharing, and the cultivation
          of relationships.</p>
      </div>
      <div class="intro-point">
        <div>3</div>
        <p>Our platform fosters a sense of belonging, collaboration, and innovation.</p>
      </div>
      <div class="intro-point">
        <div>4</div>
        <p>We're more than just a social network, we're the heartbeat of your digital connections, where conversations
          thrive and connections flourish.</p>
      </div>
      <div class="intro-point">
        <div>5</div>
        <p>Join SoConnect and experience a new era of social media.</p>
      </div>
    </div>
    <div id="intro-guide">
      <div id="intro-guide-identity">
        <picture id="intro-guide-identity-pic">
          <source type="image/webp" srcset="@/assets/app-guide-avatar.webp" />
          <source type="image/jpeg" srcset="@/assets/app-guide-avatar.jpg" />
          <img src="@/assets/app-guide-avatar.jpg" alt="guide avatar" loading="lazy" />
        </picture>
        <b>SoConnector 🧸</b>
      </div>
      <p id="intro-guide-hit">
        Hey, are you new to the SoConnect? Give me a dm and I shall hit you back with a quick guide
        tour.
      </p>
    </div>
  </div>
</template>

<style scoped>
#intro {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 2vw 3vh;
  background: linear-gradient(9deg, rgba(25, 46, 70, 1) 0% 0%, rgba(34, 82, 116, 1) 100% 100%);
}

#intro-points {
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: white;
}

#intro-points>h2 {
  font-size: 24px;
  color: #AFE64E;
}

.intro-point {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 700px;
}

.intro-point>div {
  font-size: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #8CBCDF;
}

.intro-point>p {
  font-size: 18px;
}

#intro-guide {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 400px;
  padding: 16px;
  border-radius: 16px;
  background-color: white;
}

#intro-guide-identity {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

#intro-guide-identity-pic {
  width: 256px;
}

#intro-guide-identity-pic>img {
  border-radius: 16px;
}

#intro-guide-identity>b {
  font-size: 20px;
}

#intro-guide-hit {
  font-size: 18px;
}

@media only screen and (max-width: 768px) {
  #intro {
    flex-direction: column;
    align-items: center;
  }

  #intro-points>h2 {
    text-align: center;
  }
}
</style>
