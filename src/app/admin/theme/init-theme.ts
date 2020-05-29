export class InitTheme {
    load() {
        if (localStorage.getItem('Topics') === null) {
            console.log('No Topics Found...Creating Localstorage Item');
            let topics = [];
            localStorage.setItem('Topics', JSON.stringify(topics));
            return;
        } 
        
        else {
            console.log('Found Topics...', localStorage);
        }
    }
}
