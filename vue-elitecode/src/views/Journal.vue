<template>
    <div class="journal">
        <div class="title has-text-centered">
            My Journal
        </div>
        <form
            @submit.prevent="addEntry"
        >
            <div class="columns is-mobile is-vcentered">
                <div class="column field is-one-quarter is-grouped mb-5">
                    <p class="control is-expanded">
                        <input v-model="newEntryTitle" class="input" type="text" placeholder="Question">
                    </p>
                </div>
                <div class="column field is-two-thirds is-grouped mb-5">
                    <p class="control is-expanded">
                        <input v-model="newEntrySolution" class="input" type="text" placeholder="Solution">
                    </p>
                </div>
                <div class="column field is-one-fifth is-grouped mb-5">
                    <p class="control">
                        <button :disabled="!newEntryTitle || !newEntrySolution" class="button is-info">
                        Add
                        </button>
                    </p>
                </div>
            </div>
        </form>

        <div>
            <button class="button is-fullwidth is-success is-focused mb-2" data-target="modal-js-example" @click="showModal">Learn</button>
        </div>
        <div 
        v-for="entry in entries"
        class="card mb-2"
        :class = "{ 'has-background-success-light' : entry.isDone }"
        >
            <div class="card-content">
                <div class="content">
                    <div class="columns is-mobile is-vcentered">
                        <div 
                            class="column is-one-fifth"
                            :class="{ 'has-text-success line-through' : entry.isDone }"
                        >
                            {{ entry.title }}
                        </div>
                        <div class="divider is-vertical">|</div>
                        <div 
                            class="column is-one-third"
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

    <!-- flashcard modal -->
    <div class="modal" :class="{'is-active': showModalFlag}">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
            
            <button class="delete" aria-label="close" @click="cancelModal">></button>
            </header>
            <section class="modal-card-body">
            <div class="content">
                <div v-show="!getFlippedStatus()" ref="flashCardTitle" :key="flashCardTitle">
                    <h1 ref="flashcardTitle">{{ getFlashcardTitle() }}</h1>
                </div>
                <div v-show="getFlippedStatus()" ref="flashCardTitle" :key="flashCardTitle">
                    <h1>{{ getFlashcardSolution() }}</h1>
                </div>
            </div>
            </section>
            <footer class="modal-card-foot">
            <button class="button is-success" @click="getRandomEntry()">Ok</button>
            <button class="button is-success" @click="toggleFlippedStatus()">Flip</button>
            <button class="button" @click="cancelModal">Cancel</button>
            </footer>
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
        getRandomEntry();
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

var flashcardTitle = ref("");
var flashcardSolution = ref("");
var flashcardIsFlipped = ref(false);
// get random entry from collection of entries
const getRandomEntry = (status) => {
    console.log('hi');
    // get list of document ids from firebase database
    const docIds = entries.value.map((entry) => entry.id);
    // get random document id
    const randomIndex = Math.floor(Math.random() * entries.value.length);
    const randomDocId = docIds[randomIndex];
    // get random document from firebase  collection
    const randomDoc = entries.value.find((entry) => entry.id === randomDocId);
    console.log(randomDoc);
    // return random document
    const target_copy = Object.assign({}, randomDoc);
    
    //console.log(target_copy);
    /*
    console.log(flashcardIsFlipped.value)
    if (flashcardIsFlipped.value) {
        console.log(target_copy.solution);
        flashcardIsFlipped.value = !flashcardIsFlipped.value;
        console.log(flashcardIsFlipped.value)
        return target_copy.solution;
    } else {
        console.log(target_copy.title);
        flashcardIsFlipped.value = !flashcardIsFlipped.value;
        console.log(flashcardIsFlipped.value)
        return target_copy.title;
    }*/

    flashcardTitle = target_copy.title;
    flashcardSolution = target_copy.solution;
    console.log(flashcardTitle);
    console.log(flashcardSolution);
};

const getFlippedStatus = () => {
    return flashcardIsFlipped.value;
};

const toggleFlippedStatus = () => {
    flashcardIsFlipped.value = !flashcardIsFlipped.value;
};

const getFlashcardTitle = () => {
    return flashcardTitle;
};

const getFlashcardSolution = () => {
    return flashcardSolution;
};

</script>


<script>
export default {
    data () {
        return {
            showModalFlag: false,
            okPressed: false,
            message: "Press 'Ok' or 'Cancel'.",
            flashcardIsFlipped: false,
            entry: ""
        }
    },
    methods: {
        showModal() {
            this.okPressed = false;
            this.showModalFlag = true;
        },
        
        okModal() {
            setRandomEntry();
            this.okPressed = true;
            this.showModalFlag = false;
        },
        cancelModal() {
            this.okPressed = false;
            this.showModalFlag = false;
        },
        
        flipFlashcard() {
            this.flashcardIsFlipped = !this.flashcardIsFlipped;
        },
        getEntry() {
            return this.entry;
        },
    }    
}
</script>

<style>
    .journal {
        margin: 0 auto;
        width: 50%;
    }
    .line-through {
        text-decoration: line-through;
    }
    .modal-card-body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 400px;
    }
    .modal-card-foot {
        /* move buttons to center */
        justify-content: center;
    }
</style>