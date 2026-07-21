<script setup>
import {ref} from "vue";
import axiosInstance from "../config/AxiosInstance.js";
import pathAPI from "../utils/pathAPI/pathAPI.js";
import LocalStorageService from "../utils/localstorageService.js";
import toast from "../utils/toast.js";
import router from "../routes/router.js";

const loginForm = ref({
    username: "",
    password: "",
    remember: true,
});


const handleLogin = async () => {
    // console.log("Login data:", loginForm);
    try {
        const formulaire = new FormData();
        formulaire.append('nom_client', loginForm.value.username);
        formulaire.append('mdp_client', loginForm.value.password);
        const response = await axiosInstance.post(pathAPI.login.seconnect, formulaire);
        if (response.data.error == '') {
            const token = response.data.message;
            const expirationTime = (loginForm.value.remember ) ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
            LocalStorageService.setItem('token_client', token, expirationTime);
            setTimeout(() => {

                router.push({ name: 'Main' });
            }, 500);
        }else{
            toast.showToast({msg: response.data.error, duration: 3, type: 'warning'})
        }
    }catch (e) {
        console.log(e)
    }
};

</script>

<template>
    <a-layout class="relative min-h-screen pt-16 flex flex-col items-center justify-center px-6">


<!--        <div class="flex flex-col items-center justify-center mb-8 z-10">
            <a-avatar shape="circle" :size="80">
                <font-awesome-icon class="me-0" icon="fa-solid fa-circle-user"/>
            </a-avatar>
            <span class="pt-2 text-3xl text-white capitalize"><strong class="font-bold">Trans'</strong>App</span>
        </div>-->

        <a-layout-content class="!p-0 max-w-screen-2xl bg-gray-100 w-full rounded-t-3xl z-10">
            <div class="flex flex-col items-center justify-center z-10">
                <img src="../../public/img/1-8-1.webp" alt="Logo" class="w-[50%] h-[50%] object-cover rounded-full" />
            </div>
            <a-card class="w-full">
                <template #title>
                    <span class="text-lg font-medium uppercase">Connexion</span>
                </template>

                <a-form layout="vertical" @submit.prevent="handleLogin">

                    <a-form-item label="Login" required>
                        <a-input size="large" v-model:value="loginForm.username" placeholder="Login"/>
                    </a-form-item>


                    <a-form-item label="Mot de passe" required>
                        <a-input-password size="large" v-model:value="loginForm.password" placeholder="Mot de passe"
                                          class=""/>
                    </a-form-item>

                    <!-- Checkbox "Se souvenir de moi" -->
                    <a-form-item>
                        <a-checkbox v-model:checked="loginForm.remember">Se souvenir de moi </a-checkbox>

                    </a-form-item>

                    <a-form-item>
                        <a-button size="large" block @click="handleLogin"
                                  class="!text-white bg-primary hover:bg-secondary !border-none transition duration-300">
                            Se connecter
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-card>
        </a-layout-content>

        <div class="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary to-secondary z-0">
            <div
                class="w-full h-full bg-center bg-cover opacity-15"
                style="background-image: url('/img/transite.png');"
            ></div>
        </div>
    </a-layout>
</template>

<style scoped>
</style>
