<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeWorkflow",
  data() {
    return {
      activeToggle: 0,
      activeMode: 1,
      workflowSystems: [
        { id: 1, text: "The pot base generates a magnetic field" },
        { id: 2, text: "The pot is composed of magnet" },
        { id: 3, text: "You may control the levitation mode" },
        { id: 4, text: "Regular power charging is required" },
      ],
      workflowControls: [
        {
          id: 1,
          text: "Levitate",
          description: "The pot is levitating at a staticlly set height",
        },
        {
          id: 2,
          text: "Pulse",
          description: "The pot is levitating between two static height points",
        },
        {
          id: 3,
          text: "Off",
          description: "The pot is grounded and acts as a casual flower pot",
        },
      ],
    };
  },
  computed: {
    potDynamicClass() {
      if (this.activeMode === 0) return { levitate: true };
      else if (this.activeMode === 1) return { pulse: true };
      return {};
    },
  },
  methods: {
    toggleMode(modeId) {
      this.activeMode = modeId - 1;
    },
  },
});
</script>

<template>
  <div id="workflow">
    <div id="workflow-switch">
      <template v-if="activeToggle === 0">
        <h2>How does it work?</h2>
        <div id="workflow-system">
          <div
            class="workflow-system-point"
            v-for="system in workflowSystems"
            :key="system.id"
          >
            <div class="workflow-system-point-id">{{ system.id }}</div>
            <div class="workflow-system-point-text">{{ system.text }}</div>
          </div>
        </div>
      </template>

      <template v-else>
        <h2>Control modes</h2>
        <div id="workflow-control">
          <div
            class="workflow-control-point"
            v-for="control in workflowControls"
            :key="control.id"
          >
            <div
              class="workflow-control-point-id"
              :class="{ active: control.id - 1 === activeMode }"
              @click="toggleMode(control.id)"
            ></div>
            <div class="workflow-control-point-text">
              {{ control.text }}
            </div>
            <div class="workflow-control-point-desc">
              {{ control.description }}
            </div>
          </div>
        </div>
      </template>

      <div id="workflow-toggle">
        <button
          :class="{ 'btn-1': activeToggle === 1, 'btn-2': activeToggle === 0 }"
          @click="activeToggle = 0"
        >
          SYSTEM
        </button>
        <button
          :class="{ 'btn-1': activeToggle === 0, 'btn-2': activeToggle === 1 }"
          @click="activeToggle = 1"
        >
          DEMO
        </button>
      </div>
    </div>
    <div id="workflow-demo">
      <picture :class="potDynamicClass">
        <source
          type="image/webp"
          srcset="@/assets/demo-pot.webp"
          width="478"
          height="478"
        />
        <source
          type="image/png"
          srcset="@/assets/demo-pot.png"
          width="478"
          height="478"
        />
        <img
          src="@/assets/demo-pot.png"
          alt="levitating pot"
          width="478"
          height="478"
          loading="lazy"
        />
      </picture>
      <div id="workflow-demo-pot"></div>
    </div>
  </div>
</template>

<style scoped>
#workflow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  padding: 3vh 2vw;
}

#workflow-switch {
  width: calc(100% - 300px);
}

#workflow-switch > h2 {
  font-size: 22px;
  padding-bottom: 1.8vh;
}

#workflow-system,
#workflow-control {
  display: flex;
  flex-direction: column;
  row-gap: 1vh;
}

#workflow-system {
  row-gap: 2vh;
}

.workflow-system-point,
.workflow-control-point {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.workflow-control-point-id.active,
.workflow-control-point-id:hover {
  background-color: #bdbdbd;
}

.workflow-system-point-id,
.workflow-control-point-id {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  background-color: #757575;
  cursor: pointer;
  transition: all 0.3s;
}

.workflow-system-point-text,
.workflow-control-point-text {
  font-size: 18px;
  display: flex;
  align-items: center;
  width: calc(100% - 60px);
  min-height: 40px;
  border-radius: 16px;
  padding: 4px 8px;
  background-color: #ebfdec;
}

.workflow-control-point-desc {
  width: 100%;
  padding: 6px 12px;
}

#workflow-toggle {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 2vh 3vw;
  padding: 2vh 1vw;
}

#workflow-toggle > button {
}

#workflow-demo {
}

#workflow-demo > picture.levitate {
  transform: translateY(-10%);
}

#workflow-demo > picture.pulse {
  animation: pulse 2s infinite;
}

#workflow-demo > picture {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

#workflow-demo > picture {
  width: 100%;
}

#workflow-demo-pot {
  width: 120px;
  height: 20px;
  margin: 0 auto;
  background: linear-gradient(
    135deg,
    rgba(133, 103, 99, 1) 0% 0%,
    rgba(83, 62, 58, 1) 100% 100%
  );
}

@keyframes pulse {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10%);
  }
}

@media only screen and (max-width: 720px) {
  #workflow-switch {
    order: 2;
    width: 100%;
  }

  #workflow-demo {
    order: 1;
    width: 100%;
  }

  #workflow-demo > picture {
    width: 60%;
    height: auto;
  }

  #workflow-demo-pot {
    width: 40%;
    height: 1.8vh;
  }

  #workflow-switch > h2 {
    text-align: center;
  }
}
</style>
