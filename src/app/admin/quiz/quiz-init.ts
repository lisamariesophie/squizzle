export class Init {
    load() {
      if(localStorage.getItem('quizzes') === null || localStorage.getItem('quizzes') == undefined) {
        console.log('No Quizzes Found... Creating...');
        let quizzes = [
          {
            id:1,
            parentTheme:'',
            questions: []
          }, 
         
        ]; 
        localStorage.setItem('quiz', JSON.stringify(quizzes));
        return 
      } else {
        console.log('Found quizzes...');
      }
    }
  }