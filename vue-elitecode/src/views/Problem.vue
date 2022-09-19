<template>
    <div class="title has-text-centered">
            Problem
    </div>
    <form
            @submit.prevent="addScript"
        >
            <div class="columns is-mobile is-vcentered">
                <div class="column field is-one-quarter is-grouped mb-5">
                    <p class="control is-expanded">
                        <input v-model="script" class="input" type="text" placeholder="">
                    </p>
                </div>
                <div class="column field is-one-fifth is-grouped mb-5">
                    <p class="control">
                        <button :disabled="!script" class="button is-info">
                        Add
                        </button>
                    </p>
                </div>
            </div>
        </form>
        <div class="title has-text-centered">
            {{result}}
    </div>
</template>

<script>
import { ref } from "vue";

export default {
    data () {
        return {
            script: "",
            result: "",
        }
    },
    methods: {
        runScript() {
            // run user code, return any errors
            // by creating a new function instead of using eval(), all variables are locally scoped and its safer
            try {
                this.result = new Function (this.script)(); 
            } catch (error) {
                this.result = error; 
            }
            console.log("RESULT", this.result)

        },
        addScript() {
            console.log(this.script);
            this.runScript();
            //this.script = "";
        }
    },
}    


</script>