import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {
  currentQuestion = 0;
  answers: string[] = [];
  selectedMessenger: string = ''; // Store the selected messenger

  constructor(private http: HttpClient) { }

  showNextQuestion() {
    // Get the current question element using querySelector
    const currentQuestionElement = document.querySelector('.quiz-item:nth-child(' + (this.currentQuestion + 1) + ')');
    
    if (currentQuestionElement) {
      // Get the selected option (if it's a radio or checkbox)
      const selectedOption = currentQuestionElement.querySelector('input:checked') as HTMLInputElement;

      if (selectedOption) {
        const selectedValue = selectedOption.value;
        this.answers.push(selectedValue);

        const totalQuestions = document.querySelectorAll('.quiz-item').length;
        if (this.currentQuestion < totalQuestions - 1) {
          this.currentQuestion += 1; // Show the next question
        }
        return;
      }

      // Get the entered text (if it's an input field)
      const inputField = currentQuestionElement.querySelector('input[type="text"]') as HTMLInputElement;
      if (inputField) {
        const enteredText = inputField.value;
        this.answers.push(enteredText);
      }

      if (! (selectedOption || (inputField && inputField.value))) {
          alert('Виберіть варіант відповіді!')
          return;
      }
    }

    // Check if there is a next question
    const totalQuestions = document.querySelectorAll('.quiz-item').length;
    if (this.currentQuestion < totalQuestions - 1) {
      this.currentQuestion += 1; // Show the next question
    }
  }

  finishQuiz() {
    // Get the selected messenger
    this.selectedMessenger = this.getSelectedMessenger();
    if (! this.selectedMessenger) {
      alert('Виберіть мессенджер!')
      return;
    }

    // Get the phone number input value using querySelector
    const phoneNumberInput = document.querySelector('input[name="phone"]');
    const phoneNumber = phoneNumberInput ? (phoneNumberInput as HTMLInputElement).value : '';

    // Validate the phone number (you can implement your validation logic here)
    const isPhoneNumberValid = this.validatePhoneNumber(phoneNumber);

    if (isPhoneNumberValid) {
      // Display the selected messenger and the validated phone number
      console.log(`Selected Messenger: ${this.selectedMessenger}`);
      console.log(`Validated Phone Number: ${phoneNumber}`);
    } else {
      // Handle invalid phone number
      alert('Помилка: Неправильний номер телефону.');
    }

    this.answers.push(this.selectedMessenger)
    this.answers.push(phoneNumber)

    this.http.post(`http://0.0.0.0:8000/saveOrder`, {anwers: this.answers}).subscribe((response: any) => {
      this.selectedMessenger = '';
      this.answers = []
      this.currentQuestion = 0;
    })

  }

  getSelectedMessenger(): string {
    // Determine the selected messenger based on the radio button
    const selectedOption = document.querySelector('input[name="social"]:checked');
    return selectedOption ? (selectedOption as HTMLInputElement).value : '';
  }

  validatePhoneNumber(phoneNumber: string): boolean {
    // Implement your phone number validation logic here
    // Example validation: Check if it's a valid phone number format
    // You can use a library like libphonenumber-js for more advanced validation
    const phoneRegex = /^\+?380\s?\(?(?:[0-9]{2})\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{2}[-.\s]?[0-9]{2}$/;
    return phoneRegex.test(phoneNumber);
  }

} 
