<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TeacherMenu",
  data() {
    return {
      MENU_ITEMS: [
        {
          id: 0,
          ico: "fa-solid fa-pencil",
          name: "Edit Classes",
          action: "edit"
        },
        {
          id: 1,
          ico: "fa-solid fa-clipboard-list",
          name: "Write Attendance",
          action: "write"
        },
        {
          id: 2,
          ico: "fa-solid fa-chart-line",
          name: "Read Attendance",
          action: "read"
        },
      ],
      menuToggleOn: false,
      isW512: true
    }
  },
  methods: {
    handleW512(x) {
      this.isW512 = x.matches
    },
    goTo(to) {
      if (to === "edit") this.$router.push({ name: "edit-class-choose" });
      else if (to === "write") this.$router.push({ name: "schedule" });
      else if (to === "read") this.$router.push({ name: "read-attend-choose" });
    }
  },
  mounted() {
    const x = window.matchMedia("(max-width: 512px)")

    x.addEventListener("change", this.handleW512);

    this.handleW512(x);
  }
});
</script>

<template>
  <div id="teacher-menu">
    <div id="teacher-menu-over" :class="{ 'toggle-on': menuToggleOn }">
      <div id="teacher-menu-top">
        <div id="teacher-menu-sys-ico">
          <img src="@/assets/identity/icon/icon-svg.svg" alt="system icon">
        </div>
        <p id="teacher-menu-sys-name" v-show="(menuToggleOn && !isW512) || (!menuToggleOn && isW512)">Attendance Tracker
          System</p>
        <hr id="teacher-menu-divide" v-show="menuToggleOn" />
      </div>
      <div id="teacher-menu-mid" class="scroll">
        <div v-for="item in MENU_ITEMS" :key="item.id" @click="goTo(item.action)" class="teacher-menu-mid-item">
          <i :class="item.ico"></i>
          <p v-show="menuToggleOn">{{ item.name }}</p>
        </div>
      </div>
      <div id="teacher-menu-bot">
        <i v-show="!menuToggleOn" @click="menuToggleOn = true" class="fa-solid fa-bars"></i>
        <i v-show="menuToggleOn" @click="menuToggleOn = false" class="fa-solid fa-xmark"></i>
      </div>
    </div>
  </div>
</template>

<style scoped>
#teacher-menu {
  z-index: 10;
  width: 80px;
  color: white;
}

#teacher-menu-over {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80px;
  height: 100%;
  padding: 8px;
  background-color: #0097A7;
  transition: 0.2s width;
}

#teacher-menu-over.toggle-on {
  width: 300px;
}

#teacher-menu-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

#teacher-menu-sys-ico {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: white;
}

#teacher-menu-sys-ico>img {
  width: 90%;
}

#teacher-menu-sys-name {}

#teacher-menu-divide {
  width: 30%;
  height: 3px;
  border: none;
  background-color: white;
}

#teacher-menu-mid {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  gap: 20px;
  padding-left: 0;
  overflow-y: auto;
}

#teacher-menu-over.toggle-on #teacher-menu-mid {
  padding-left: 8px;
}

.teacher-menu-mid-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s all;
}

#teacher-menu-over.toggle-on .teacher-menu-mid-item {
  justify-content: flex-start;
}

.teacher-menu-mid-item:hover {
  color: #034249;
}

.teacher-menu-mid-item>i {
  font-size: 36px;
  width: auto;
}

#teacher-menu-over.toggle-on .teacher-menu-mid-item>i {
  font-size: 28px;
  width: 38px;
}

.teacher-menu-mid-item>p {}

#teacher-menu-bot {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 4vh;
}

#teacher-menu-bot>i {
  font-size: 40px;
  cursor: pointer;
  transition: 0.2s all;
}

#teacher-menu-bot>i:hover {
  color: #034249;
}

@media only screen and (max-width: 512px) {
  #teacher-menu {
    height: 60px;
    width: 100%;
  }

  #teacher-menu-over {
    flex-direction: row;
    height: 60px;
    width: 100%;
  }

  #teacher-menu-over.toggle-on {
    height: 90px;
    width: 100%;
  }

  #teacher-menu-top {
    flex-direction: row;
  }

  #teacher-menu-sys-ico {
    width: 40px;
    height: 40px;
  }

  #teacher-menu-mid {
    position: absolute;
    top: 50%;
    left: 0;
    flex-direction: row;
    height: 100%;
    width: calc(100% - 40px);
    background-color: #0097A7;
    overflow-x: auto;
    transform: translateY(-150%);
    transition: 0.2s transform;
  }

  #teacher-menu-over.toggle-on #teacher-menu-mid {
    transform: translateY(-50%);
  }

  .teacher-menu-mid-item {
    flex-shrink: 0;
    flex-direction: column;
  }

  #teacher-menu-over.toggle-on .teacher-menu-mid-item {
    justify-content: center;
    text-align: center;
  }

  #teacher-menu-bot {
    padding-top: 0;
  }
}
</style>
