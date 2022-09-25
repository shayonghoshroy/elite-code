<template>
<div class="black" v-for="(week, index) in schedule" :key="week.name">
    <h3 class="title mb-2">Week {{index + 1}}</h3>
    <div v-for="(key, value) in week" :key="key.name">
        <p class="mt-4">{{value}}</p>
        <!-- bullet list -->
        <div v-for="problem in key" :key="problem.name">
            <li class="content ml-4">{{Object.keys(problem)[0]}}: {{Object.values(problem)[0]}} </li>
        </div>
    </div>
</div>
</template>

<script>
    import { ref } from "vue";
    import { db } from '@/firebase';
    import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
    import { getAuth } from "firebase/auth";
    
    export default {
        data () {
            return {
                problemsCollection: collection(db, "problems"),
                scheduleCollection: collection(db, "schedules"),
                problems: [],
                schedule: null
            }
        },
        beforeMount: function () {
            this.setProblems();
            this.setSchedule();
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
            sortSchedule(temp) {
                // sort each week in the schedule to be in order by day
                // loop through each week in temp
                for (var i = 0; i < temp.length; i++) {
                    // loop through each day in the week
                    console.log(temp[i])
                }
                //console.log(temp);
            },
            async setSchedule() {
                // get the schedule doc from the schedules collection that has the same uid field as the current user
                
                const docRef = doc(this.scheduleCollection, getAuth().currentUser.uid);
                const docSnap = await getDoc(docRef);
                
                console.log(getAuth().currentUser.uid);
                if (docSnap) {
                    const target_copy = Object.assign({}, docSnap.data());
                    this.schedule = target_copy.schedule;
                    this.sortSchedule(target_copy.schedule);
                } else {
                    //doc.data() will be undefined in this case
                    console.log("No such document!");
                } 
            }
        },
    }    
    </script>

    <style>
        body {  
            height: 100vh;
        } 
        
        .black {
            background-color: #181a1b;
            color: #fff;
            padding-top: 30px;
            text-align: center;
        }
        
    </style>