<template>
    <!-- for loop to run thru problems and get a router link to it -->
    <h3 class="title mt-5 mb-5">Problems</h3>
    <div 
        v-for="problem in problems"
        class="card mb-2"
        >
            <div class="card-content">
                <a v-bind:href="'/problem/'+problem.id">
                    <div class="content">
                        <div class="columns is-mobile is-vcentered">
                            <div 
                                class="column is-three-fifths"
                            >
                                {{problem.title}}
                            </div>
                            <div class="column is-two-fifths has-text-right">
                                <button 
                                    class = "button mr-5 is-warning"
                                >
                                    {{problem.type}}
                                </button>
                                <button 
                                    class = "button is-success"
                                >
                                    {{problem.difficulty}}
                                </button>
                            </div>
                        </div>
                    </div>
                </a>   
            </div>
        </div>
</template>
    
    <script>
        
        import { db } from '@/firebase';
        import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
        import { getAuth } from "firebase/auth";
        
        export default {
            data () {
                return {
                    problemsCollection: collection(db, "problems"),
                    problems: [],
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
            }
            .card {
                /* a href link doesnt change color of text */
                width: 30%;
                margin: auto;

            }
            .title {
                /* center */
                text-align: center;
            }
            a {
                text-decoration: none; 
                color: black; 
            }
        </style>