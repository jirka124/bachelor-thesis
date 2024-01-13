<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeWelcome",
});
</script>

<template>
  <div id="welcome">
    <div id="welcome-cont">
      <div id="welcome-box">
        <picture id="welcome-icon">
          <source type="image/webp" srcset="@/assets/identity/icon/icon-128.webp" />
          <source type="image/png" srcset="@/assets/identity/icon/icon-128.png" />
          <img src="@/assets/identity/icon/icon-128.png" alt="company icon" loading="lazy" />
        </picture>
        <h2 id="welcome-media">Welcome to SoConnect</h2>
        <em id="welcome-intro">The social media of 21's century, simple, fast and fun.</em>
        <div id="welcome-features">
          <div class="welcome-feature">
            <b>Observe</b>
            <div><i class="fa-solid fa-tower-observation"></i></div>
            <p>watch the posts of other people, observe their emotions and intentions.</p>
          </div>
          <div class="welcome-feature">
            <b>Share</b>
            <div><i class="fa-solid fa-share-nodes"></i></div>
            <p>Share your own posts whenever you feel like it, it's simple and takes little to no time.</p>
          </div>
          <div class="welcome-feature">
            <b>Observe</b>
            <div><i class="fa-solid fa-people-group"></i></div>
            <p>Someone sharing interesting content over and over again? Add them as friends.</p>
          </div>
        </div>
      </div>
      <p id="welcome-call">And that's just a beggining, <span>so connect</span>, stop hesitate.</p>
    </div>
  </div>
</template>

<style scoped>
#welcome {
  position: relative;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding: 16px 1vw;
  background-color: white;
}

#welcome-cont {
  text-align: center;
  position: relative;
  top: -60px;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  max-width: 800px;
}

#welcome-box {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  padding: 32px;
  border-radius: 24px;
  background-color: #CCE9FF;
}

#welcome-icon {
  position: absolute;
  top: 0;
  left: 50%;
  width: 80px;
  transform: translate(-50%, -50%);
}

#welcome-icon>img {
  display: block;
}

#welcome-media {
  font-size: 24px;
}

#welcome-intro {
  font-size: 18px;
}

#welcome-features {
  display: flex;
  gap: 24px;
}

.welcome-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 8px;
  min-height: 300px;
  padding: 16px;
  border-radius: 16px;
  color: white;
}

.welcome-feature:nth-child(even) {
  background-color: #225274;
}

.welcome-feature:nth-child(odd) {
  background-color: #192E46;
}

.welcome-feature>b {
  font-size: 20px;
}

.welcome-feature>div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 24px;
}

.welcome-feature:nth-child(even)>div {
  background-color: #192E46;
}

.welcome-feature:nth-child(odd)>div {
  background-color: #225274;
}

.welcome-feature>div>i {
  font-size: 30px;
}

.welcome-feature>p {}

#welcome-call {}

#welcome-call>span {
  font-weight: bold;
  cursor: pointer;
}

@media only screen and (max-width: 768px) {
  #welcome-features {
    flex-wrap: wrap;
    justify-content: center;
  }

  .welcome-feature {
    max-width: 400px;
    min-height: auto;
  }
}
</style>
