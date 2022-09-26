<template>

    
<div class="black" v-for="(week, index) in schedule" :key="week.name">
    <h1 class="title mb-2 has-text-info">Week {{index + 1}}</h1>
    <div v-for="(key, value) in week" :key="key.name">
        <div class="content"><h4 class="has-text-white ml-6 mt-5">{{value}}</h4></div>
                <!-- bullet list -->
                <div class="concept-list" v-for="problem in key" :key="problem.name" :value="value">
                    <!-- nested table with key and value-->
                    <li :class="Object.values(problem)[0]">{{Object.keys(problem)[0]}}</li>
                </div> 
    </div>

    <div class="divider"></div>
    
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
                var sortedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

                for (var i = 0; i < temp.length; i++) {
                    // loop through each day in the week
                    //console.log(temp[i])
                    var sortedWeek = temp[i]
                    // sort the week dict so that the day keys are in order
                    sortedWeek = Object.keys(sortedWeek).sort(function(a,b) {
                        return sortedDays.indexOf(a) - sortedDays.indexOf(b);
                    }).reduce(function (result, key) {
                        result[key] = temp[i][key];
                        return result;
                    }, {});
                    temp[i] = sortedWeek
                }
                this.schedule = temp
            },
            async setSchedule() {
                // get the schedule doc from the schedules collection that has the same uid field as the current user
                
                const docRef = doc(this.scheduleCollection, getAuth().currentUser.uid);
                const docSnap = await getDoc(docRef);
                
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
            padding-left: 5px;
            /* increase font size */
            font-size: 1.2em;
    
        }
        .divider {
            border-bottom: 10px solid #fff;
            width: 50%;
            margin: auto;
        }

        .table {
            margin: auto;
            background-color: white;
            color: black;
            
        }
        .easy {
            color: green
        }
        .medium {
            color: orange
        }
        .hard {
            color: red
        }
        .content {
            color: white;
        }
        .concept-list {
            margin-left: 100px;
        }
        .divider {
            width: 100%;
            padding-top: 30px;
            /* change background color */
        }

        
    </style>