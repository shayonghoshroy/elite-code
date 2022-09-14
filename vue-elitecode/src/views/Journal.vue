<template>
    <div class="journal">
        <div class="title has-text-centered">
            My Journal
        </div>
        <form
            @submit.prevent="addEntry"
        >
            <div class="field is-grouped mb-5">
                <p class="control is-expanded">
                    <input v-model="newEntryContent" class="input" type="text" placeholder="Add a summary">
                </p>
                <p class="control">
                    <button :disabled="!newEntryContent" class="button is-info">
                    Add
                    </button>
                </p>
            </div>
        </form>
        <div 
        v-for="entry in entries"
        class="card mb-2"
        >
            <div class="card-content">
                <div class="content">
                    <div class="columns is-mobile is-vcentered">
                        <div class="column">
                            {{ entry.content }}
                        </div>
                        <div class="column is-5 has-text-right">
                            <button class="button is-light">
                                &check;
                            </button>
                            <button class="button is-danger ml-2">
                                &cross;
                            </button>
                        </div>
                    </div>
                
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

// todos
const entries = ref([
    /*
    {
        id: 1,
        content: "Two pointer",
        isDone: false
    }
    */
]);

// add todo
const newEntryContent = ref("");
const addEntry = () => {
    entries.value.push({
        id: entries.value.length + 1,
        content: newEntryContent.value,
        isDone: false,
    });
    newEntryContent.value = "";
};
</script>

<style>
    .journal {
        margin: 0 auto;
        width: 50%;
    }
</style>