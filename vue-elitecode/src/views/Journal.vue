<template>
    <div class="journal">
        <div class="title has-text-centered">
            My Journal
        </div>
        <div class="field is-grouped mb-5">
            <p class="control is-expanded">
                <input class="input" type="text" placeholder="Add a summary">
            </p>
            <p class="control">
                <a class="button is-info">
                Add
                </a>
            </p>
        </div>

        <div 
        v-for="i in 3"
        class="card mb-2"
        >
            <div class="card-content">
                <div class="content">
                    <div class="columns is-mobile is-vcentered">
                        <div class="column">
                            Two pointer.
                        </div>
                        <div class="column is-5 has-text-right">
                            <button class="button is-success">
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

<style>
    .journal {
        margin: 0 auto;
        width: 50%;
    }
</style>