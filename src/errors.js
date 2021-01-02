export class AlreadyDefinedError extends Error {
   constructor(message){
       super(message);
       this.name = "AlreadyDefinedError"
   } 
}

export class DuplicateComponentsDefinedError extends Error {
    constructor(message){
        super(message);
        this.name = "DuplicateComponentsDefinedError";
    }
}