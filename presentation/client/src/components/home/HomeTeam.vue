<script>
import { defineComponent } from "vue";
import HomeTeamItem from "@/components/home/HomeTeamItem.vue";

export default defineComponent({
  name: "HomeTeam",
  components: { HomeTeamItem },
  data() {
    return {
      team: [
        {
          id: 0,
          name: "Michael Anderson",
          title: "Leader",
          desc: "The person responsible for guiding the group's overall vision and strategy, making critical decisions, and representing the group as a whole."
        },
        {
          id: 1,
          name: "Daniel Patel",
          title: "Campaign Manager",
          desc: "The individual in charge of organizing and overseeing the group's election campaigns, ensuring that they run smoothly and effectively."
        },
        {
          id: 2,
          name: "William Clark",
          title: "Communications Director",
          desc: "The person responsible for managing the group's public image, including press releases, media relations, and social media presence."
        },
        {
          id: 3,
          name: "Emily Martinez",
          title: "Community Organizer",
          desc: "This role focuses on grassroots efforts, engaging with local communities, and mobilizing support for the group's initiatives."
        },
        {
          id: 4,
          name: "Benjamin Hughes",
          title: "Policy Analyst",
          desc: "The expert who researches and develops policy proposals, ensuring that the group's ideas are well-informed and feasible."
        },
        {
          id: 5,
          name: "Joseph Robinson",
          title: "Fundraising Coordinator",
          desc: "Responsible for securing financial resources to support the group's activities, including organizing events and managing donations."
        },
        {
          id: 6,
          name: "Olivia Turner",
          title: "Youth Outreach Coordinator",
          desc: "Focused on connecting with younger generations and engaging them in the group's mission, working to inspire and involve the next wave of political leaders."
        }
      ]
    }
  },
});
</script>

<template>
  <div id="home-team">
    <div id="home-team-caption" class="home-caption">
      ❖ <h2>OUR REPRESENTATIVES</h2>
    </div>
    <div id="home-representatives">
      <HomeTeamItem v-for="member in team" :key="member.id" :person="member" />
    </div>
  </div>
</template>

<style scoped>
#home-team {
  padding: 16px;
  background-color: #EAEAEA;
}

#home-representatives {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px 16px;
}

@media only screen and (max-width: 800px) {
  #home-representatives {
    justify-content: space-around;
  }
}
</style>