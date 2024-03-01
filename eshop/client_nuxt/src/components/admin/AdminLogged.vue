<script>
import { defineComponent } from "vue";
import { mapStores } from "pinia";
import { useAdminStore } from "@/stores/admin";

export default defineComponent({
  name: "AdminLogged",
  computed: {
    ...mapStores(useAdminStore),
  },
  methods: {
    async logout() {
      let r;
      try {
        r = (await this.$api.post("admin/logout")).data;
        if (r.reqState !== null) console.log(r.reqState);
        else location.reload();
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>

<template>
  <div id="admin-logged">
    <div id="admin-logged-user">
      <div id="admin-logged-user-avatar"><i class="fa-solid fa-robot"></i></div>
      <div id="admin-logged-user-info">
        <p>{{ adminStore.adminName || "ADMIN NAME" }}</p>
        <button @click="logout">
          logout <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#admin-logged {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 8px;
}

#admin-logged-user {
  display: flex;
  flex-wrap: wrap;
}

#admin-logged-user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: black;
}

#admin-logged-user-avatar * {
  font-size: 30px;
}

#admin-logged-user-info {
}

#admin-logged-user-info > p {
}

#admin-logged-user-info > button {
  color: black;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
}
</style>
