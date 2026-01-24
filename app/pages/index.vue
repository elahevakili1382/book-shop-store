<template>
    <main>
        <HeroSection/>
        <Features/>
        <NewArrival/>
        <BestSelling/>
        <DealsOfDay/>
        <ShopWithUs/>
        <JoinWithUs/>
    </main>
</template>

<script setup lang="ts">
    
import HeroSection from '../components/HeroSection.vue';
import Features from '../components/Features.vue';
import NewArrival from '../components/NewArrival.vue';
import BestSelling from '../components/BestSelling.vue';
import DealsOfDay from '../components/DealsOfDay.vue';
import ShopWithUs from '../components/ShopWithUs.vue';
import JoinWithUs from '../components/JoinWithUs.vue';


definePageMeta({
    layout:'default',
})
</script>



