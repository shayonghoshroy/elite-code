<template>
    <div class="journal">
        <div class="title has-text-centered">
            My Journal
        </div>
        <form
            @submit.prevent="addEntry"
        >
            <div class="columns is-mobile is-vcentered">
                <div class="column field is-grouped mb-5">
                    <p class="control is-expanded">
                        <input v-model="newEntryTitle" class="input" type="text" placeholder="Question">
                    </p>
                </div>
                <div class="column field is-grouped mb-5">
                    <p class="control is-expanded">
                        <input v-model="newEntrySolution" class="input" type="text" placeholder="Solution">
                    </p>
                </div>
                <div class="column field is-grouped mb-5">
                    <p class="control">
                        <button :disabled="!newEntryTitle || !newEntrySolution" class="button is-info">
                        Add
                        </button>
                    </p>
                </div>
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
                            {{ entry.title }}
                        </div>
                        <div class="divider is-vertical">|</div>
                        <div 
                            class="column"
                            :class="{ 'has-text-success line-through' : entry.isDone }"
                        >
                            {{ entry.solution }}
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
import { onMounted, ref } from "vue";
import { getAuth } from "firebase/auth";
import { collection, getDocs, onSnapshot, query, where, deleteDoc, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase';


// entries
const entries = ref([
]);
const entriesCollection = collection(db, "entries");
const uid = getAuth().currentUser.uid;

onMounted(async () => {
    // get the users uid
    //const uid = getAuth().currentUser.uid;

    onSnapshot(query(entriesCollection, where("uid", "==", uid)), (querySnapshot) => {
        // populate the entires table
        entries.value = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
    });
    
});

// add entry
const newEntryTitle = ref("");
const newEntrySolution = ref("");
const addEntry = () => {
    // Add a new document with a generated id.
    const docRef = addDoc(entriesCollection, {
        title: newEntryTitle.value,
        solution: newEntrySolution.value,
        isDone: false,
        uid: uid,
    });
    newEntryTitle.value = "";
    newEntrySolution.value = "";
};

//toggle the isDone property
const toggleIsDone = (id) => {
    const entry = entries.value.find((entry) => entry.id === id);
    updateDoc(doc(entriesCollection, id), {
        isDone: !entry.isDone
    });
};

// delete entry
const deleteEntry = (id) => {
    // delete entry from firebase database
    deleteDoc(doc(entriesCollection, id));
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