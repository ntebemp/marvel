import React, { Fragment, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QuizMarvel } from '../quizMarvel/'
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import QuizOver from '../QuizOver'
import { FaChevronRight } from 'react-icons/fa';


const Quiz = (props) => {

    const levelNames = ["debutant", "confirme", "expert"];
    const [quizLevel, setQuizLevel] = useState(0);
    const [maxQuestions, setMaxQuestions] = useState(10);
    const [storedQuestions, setStoredQuestions] = useState([]);
    const [question, setQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [idQuestion, setIdQuestion] = useState(0);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [userAnswer, setUserAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [showWelcomeMsg, setShowWelcomeMsg] = useState(false);
    const [quizEnd, setQuizEnd] = useState(false);
    const [percent, setPercent] = useState(null);
    const [storedDataRef, setstoredDataRef] = useState(null);

  

const loadQuestions = quizz => {
  const fetchedArrayQuiz = QuizMarvel[0].quizz[quizz];
  if (fetchedArrayQuiz.length >= maxQuestions) {

    const updatedStoredDataRef = { ...storedDataRef, focus: fetchedArrayQuiz };
    setstoredDataRef(updatedStoredDataRef);
    const newArray = fetchedArrayQuiz.map(({ answer, ...keepRest }) => ({ answer, ...keepRest }));

    setStoredQuestions(newArray);

  }
}

    const showToastMsg = (pseudo) => {
        if(!showWelcomeMsg) {

            setShowWelcomeMsg(true)

            toast.warn(`Bienvenue ${pseudo}, et bonne chance!`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                bodyClassName: "toastify-color-welcome"
            });
        }
    }
   

    useEffect(() => {
        loadQuestions(levelNames[quizLevel])
    }, [])//componentDidMount

    const nextQuestion = () => {
        if (idQuestion === maxQuestions - 1) {

            setQuizEnd(true)

        } else {

            setIdQuestion(idQuestion + 1 )
        }
       
        const goodAnswer = storedDataRef.focus[idQuestion].answer;

        if (userAnswer === goodAnswer) {
            
            setScore( score + 1 )

            toast.success('Bravo +1', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                bodyClassName: "toastify-color"
            });
        } else {
            toast.error('Raté 0', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                bodyClassName: "toastify-color"
            });
        }
    }
   
    useEffect(() => {
        

        if (storedQuestions && storedQuestions.length) {
           
          
            setQuestion( storedQuestions[idQuestion].question)
            setOptions( storedQuestions[idQuestion].options)
            
        }

        if (idQuestion && storedQuestions.length) {
            setQuestion( storedQuestions[idQuestion].question)
            setOptions( storedQuestions[idQuestion].options)
            setUserAnswer(null)
            setBtnDisabled(true)
        }
 
        if ( quizEnd ) {
            const gradepercent = getPercentage(maxQuestions, score);
            gameOver(gradepercent);
        }
        
    },[storedQuestions, idQuestion, quizEnd])//componentDidUpdate

    useEffect(() => {
    if (props.userData.pseudo) {
        showToastMsg(props.userData.pseudo)
    }

    },[props.userData.pseudo])//componentDidUpdate

    
    const submitAnswer = selectedAnswer => {
        setUserAnswer(selectedAnswer)
        setBtnDisabled(false)
    }

    const getPercentage = (maxQuest, ourScore) => (ourScore / maxQuest) * 100;

    const gameOver = percent => {

        if (percent >= 50) {
            setQuizLevel(quizLevel + 1)
            setPercent(percent)
        } else {
            setPercent(percent)
        }


    }

    const loadLevelQuestions = param => {

           setMaxQuestions(10)
           setStoredQuestions([])
            setQuestion(null)
            setOptions([])
            setIdQuestion(0)
            setBtnDisabled(true)
            setUserAnswer(null)
            setScore(0)
            setShowWelcomeMsg(false)
            setQuizEnd(false)
            setPercent(null)
            setstoredDataRef(null)
            setQuizLevel(param)

        loadQuestions(levelNames[param]);
    }
    
    const displayOptions = options && options.length > 0 ? options.map((option, index) => {
        return (
          <p key={index} 
             className={`answerOptions ${userAnswer === option ? "selected" : null}`}
             onClick={() => submitAnswer(option)}
          >
             <FaChevronRight /> {option}
          </p>
        );
      }) : null;


     return quizEnd ? (
        <QuizOver 
            storedDataRef={storedDataRef}
            levelNames={levelNames}
            score={score}
            maxQuestions={maxQuestions}
            quizLevel={quizLevel}
            percent={percent}
            loadLevelQuestions={loadLevelQuestions}
        />
    )
    :
    (
        <Fragment>
            <Levels
             levelNames={levelNames}
             quizLevel={quizLevel}
            />

            <ProgressBar 
            idQuestion={idQuestion}
            maxQuestions={maxQuestions}
            />
            <h2>{question}</h2>
            
            { displayOptions }

            <button 
               disabled={btnDisabled} 
               className="btnSubmit"
               onClick={nextQuestion}
            >
            {idQuestion < maxQuestions - 1 ? "Suivant" : "Terminer"}
            </button>
            <ToastContainer />
        </Fragment>
    );
}

export default Quiz;
