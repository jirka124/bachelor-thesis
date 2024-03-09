<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeTeamItem",
  props: {
    person: {
      type: Object,
      default() {
        return {
          id: -1,
          name: "No Name",
          title: "No Position",
          desc: "No Description"
        }
      }
    }
  },
  data() {
    return {
      alternativeToggleOn: false,
    }
  }
});
</script>

<template>
  <div class="home-team-item" :class="{ 'alternative-view': alternativeToggleOn }"
    @click="alternativeToggleOn = !alternativeToggleOn">
    <div class="home-team-item-crop">
      <div class="home-team-item-deco">❖</div>
      <div class="team-item-cont">
        <div class="team-item-main">
          <picture class="team-item-avatar">
            <source type="image/webp" :srcset="`/team/${person.id}.webp`" width="512" height="512" />
            <source type="image/jpeg" :srcset="`/team/${person.id}.jpg`" width="512" height="512" />
            <img :src="`/team/${person.id}.jpg`" :alt="person.title" width="512" height="512" loading="lazy" />
          </picture>
          <p class="team-item-name">{{ person.name }}</p>
          <p class="team-item-title">{{ person.title }}</p>
        </div>
        <div class="team-item-alter">
          <p class="team-item-desc">{{ person.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  --size-modify: 1;
}

.home-team-item {
  position: relative;
  width: calc(300px * var(--size-modify));
  border-radius: calc(16px * var(--size-modify));
  background-color: black;
  cursor: pointer;
  aspect-ratio: 3 / 4;
}

.home-team-item-crop {
  border-radius: calc(16px * var(--size-modify));
  overflow: hidden;
  aspect-ratio: 3 / 4;
}

.home-team-item-deco {
  font-size: 40px;
  z-index: 3;
  position: absolute;
  top: 0;
  left: 50%;
  color: #FFD700;
  transform: translate(-50%, -50%);
  transition: font-size 1s cubic-bezier(0.29, 1.01, 1, -0.68);
}

.home-team-item.alternative-view .team-item-cont {
  transform: translateY(-50%);
}

.home-team-item.alternative-view .home-team-item-deco {
  font-size: 80px;
}

.team-item-cont {
  width: 100%;
  transition: transform 1s cubic-bezier(.29, 1.01, 1, -0.68);
}

.team-item-main {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(20px * var(--size-modify)) calc(4px * var(--size-modify));
  background-color: #1a1a1a;
  aspect-ratio: 3 / 4;
}

.team-item-avatar {
  width: 90%;
}

.team-item-avatar>img {
  width: 100%;
}

.team-item-name {
  font-size: calc(20px * var(--size-modify));
  color: white;
}

.team-item-title {
  font-size: calc(12px * var(--size-modify));
  color: #bfbfbf;
}

.team-item-alter {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(8px * var(--size-modify));
  aspect-ratio: 3 / 4;
}

.team-item-desc {
  text-align: center;
  color: white;
}

@media only screen and (max-width: 800px) {

  .home-team-item:nth-of-type(1),
  .home-team-item:nth-of-type(1) * {
    --size-modify: 1.4;
  }
}

@media only screen and (max-width: 500px) {

  .home-team-item:nth-of-type(1) {
    width: 100%;
  }

  .home-team-item {
    width: 90%;
  }

  .team-item-name {
    font-size: calc(4.2vw * var(--size-modify));
  }

  .team-item-title {
    font-size: calc(2.4vw * var(--size-modify));
  }

  .team-item-desc {
    font-size: calc(2.6vw * var(--size-modify));
  }
}
</style>