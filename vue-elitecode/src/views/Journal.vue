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
        :class = "{ 'has-background-success-light' : entry.isDone }"
        >
            <div class="card-content">
                <div class="content">
                    <div class="columns is-mobile is-vcentered">
                        <div 
                            class="column"
                            :class="{ 'has-text-success line-through' : entry.isDone }"
                        >
                            {{ entry.content }}
                        </div>
                        <div class="column is-5 has-text-right">
                            <button 
                                :class = "entry.isDone ? 'button is-success' : 'button is-light'"
                                @click="toggleIsDone(entry.id)"
                            >
                                &check;
                            </button>
                            <button @click="deleteEntry(entry.id)" class="button is-danger ml-2">
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
    {
        id: 1,
        content: "Two pointer",
        isDone: true
    },
    {
        id: 2,
        content: "Sliding Window",
        isDone: false
    }
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

//toggle the isDone property
const toggleIsDone = (id) => {
    const entry = entries.value.find((entry) => entry.id === id);
    entry.isDone = !entry.isDone;
};

// delete todo
const deleteEntry = (id) => {
    entries.value = entries.value.filter((entry) => entry.id !== id);
};
</script>

<style>
    .journal {
        margin: 0 auto;
        width: 50%;
    }
    .line-through {
        text-decoration: line-through;
    }
</style>