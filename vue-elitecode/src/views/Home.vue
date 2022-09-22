<template>
<h1 class="title has-text-centered">Home</h1>
<!-- for loop to run thru problems and get a router link to it -->
<div v-for="problem in problems">
    <router-link v-bind:to="'/problem/'+problem.id">{{problem.title}}</router-link>
</div>



</template>

<script>
    import { ref } from "vue";
    import { db } from '@/firebase';
    import { collection, getDocs } from "firebase/firestore";
    import { getAuth } from "firebase/auth";
    
    export default {
        data () {
            return {
                problemsCollection: collection(db, "problems"),
                problems: []
            }
        },
        beforeMount: function () {
            this.setProblems();
        },
        methods: {
            setProblems() {
                // get all problems
                getDocs(this.problemsCollection).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        //console.log(doc.id, " => ", doc.data());
                        this.problems.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                });
            },
        },
    }    
    </script>