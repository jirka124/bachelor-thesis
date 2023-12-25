<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeMission",
});
</script>

<template>
  <div id="home-mission">
    <div id="home-mission-caption" class="home-caption">
      ❖ <h2>OUR MISSION</h2>
    </div>
    <div id="home-missions">
      <div class="mission-item">
        <div class="mission-item-avatar">
          <i class="fa-solid fa-fingerprint"></i>
        </div>
        <p class="mission-item-text">The Unity Vanguard" is a collective of visionary politicians committed to harnessing
          the power of diversity and
          inclusivity in order to drive progress and positive change in our society. They believe that by working
          together, they can create a brighter future for all citizens, regardless of their backgrounds.</p>
      </div>
      <div class="mission-item">
        <div class="mission-item-avatar">
          <i class="fa-solid fa-scale-balanced"></i>
        </div>
        <p class="mission-item-text">Their slogan, "Strength in Diversity, Progress for All," embodies their core
          principle of unity in the face of challenges, celebrating the richness of varied perspectives and experiences,
          and striving for inclusive, forward-thinking policies.</p>
      </div>
      <div class="mission-item">
        <div class="mission-item-avatar">
          <i class="fa-solid fa-bridge-water"></i>
        </div>
        <p class="mission-item-text">"The Unity Vanguard" aims to be the bridge builders, leading the way toward a more
          harmonious and equitable world where every voice matters and every individual can thrive.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
#home-mission {
  padding: 16px;
}

#home-missions {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}

.mission-item {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px 12px;
}

.mission-item-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
  flex-shrink: 0;
  border-radius: 8px;
  width: 88px;
  height: 88px;
  background-color: #EAEAEA;
}

.mission-item-avatar>i {
  font-size: 48px;
}

.mission-item-text {}

@media only screen and (max-width: 800px) {
  .mission-item {
    text-align: center;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>