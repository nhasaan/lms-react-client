import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Form, Grid, Header, Radio, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { AnswerFormValues } from '../../../app/models/answer';
import { Question } from '../../../app/models/question';
import { useStore } from '../../../app/stores/store';
import QuestionListItem from './QuestionListItem';
import * as Yup from 'yup';

export default observer(function QuestionList() {
    const { questionStore } = useStore();
    const { questionsByDate } = questionStore;
    const { lessonId } = useParams<{ lessonId: string }>();

    const history = useHistory();
    const { answerStore } = useStore();
    const { createAnswer, loadAnswer, updateAnswer, loadingInitial } = answerStore;
    // const { lessonId } = useParams<{ lessonId: string }>();
    const { questionId } = useParams<{ questionId: string }>();
    const { id } = useParams<{ id: string }>();

    const [answer, setAnswer] = useState<AnswerFormValues>(new AnswerFormValues());
    const [selected, setSelected] = useState<string>('');

    const validationSchema = Yup.object({
        selected: Yup.string().required('Selecting an answer is required!')
    })

    function handleFormSubmit() {
        if (!answer.id) {
            let newAnswer = {
                ...answer
            };
            createAnswer(questionId, newAnswer).then(() => console.log('answer submited saved'))
        } else {
            updateAnswer(answer).then(() => history.push(`/answers/${answer.id}`))
        }
    }
    const userSelections = (length: number) => {
        const initialValues = [];
        for (let i = 0; i < questionsByDate.length; i++) {
            initialValues.push({ question: i, answer: '' });
        }

        return initialValues;
    }

    const userSelection = { answers: userSelections(questionsByDate.length) };

    if (loadingInitial) return <LoadingComponent content='Loading answer...' />

    return (
        <>
            <Fragment>
                <Grid>
                    <Grid.Column width={8} >
                        <Header color='teal'>Question List</Header>
                    </Grid.Column>
                    <Grid.Column width={8} >
                        {questionsByDate.length !== 10 &&
                            <Button
                                as={Link}
                                to={`/createQuestion/${lessonId}`}
                                color='teal'
                                floated='right'
                                content='Create question'
                            />
                        }</Grid.Column>
                </Grid>
                <Grid>
                    <Grid.Column width={16} >
                        <Formik enableReinitialize={true} initialValues={userSelection} onSubmit={handleFormSubmit}>
                            {({ values, handleBlur, handleChange, handleSubmit, isSubmitting, dirty }) => (
                                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                    {questionsByDate.map((question: Question, index) => (
                                        <Segment.Group key={index}>
                                            <QuestionListItem question={question} />
                                            <Segment attached>
                                                <Radio
                                                    label={question.a}
                                                    id={question.a + index}
                                                    name={`answers[${index}].answer`}
                                                    value='a'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={
                                                        values.answers && values.answers[index]
                                                            ? values.answers[index].answer === 'a'
                                                            : false
                                                    } />
                                            </Segment>
                                            <Segment attached>
                                                <Radio
                                                    label={question.b}
                                                    id={question.b + index}
                                                    name={`answers[${index}].answer`}
                                                    value='b'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={
                                                        values.answers && values.answers[index]
                                                            ? values.answers[index].answer === 'b'
                                                            : false
                                                    } />
                                            </Segment>
                                            <Segment attached>
                                                <Radio
                                                    label={question.c}
                                                    id={question.c + index}
                                                    name={`answers[${index}].answer`}
                                                    value='c'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={
                                                        values.answers && values.answers[index]
                                                            ? values.answers[index].answer === 'c'
                                                            : false
                                                    } />
                                            </Segment>
                                            <Segment attached>
                                                <Radio
                                                    label={question.d}
                                                    id={question.d + index}
                                                    name={`answers[${index}].answer`}
                                                    value='d'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={
                                                        values.answers && values.answers[index]
                                                            ? values.answers[index].answer === 'd'
                                                            : false
                                                    } />
                                            </Segment>
                                        </Segment.Group>
                                    ))}
                                    <pre>{JSON.stringify(values)}</pre>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        Submit
                                    </button>
                                </Form>
                            )}
                        </Formik></Grid.Column>
                </Grid>
                {questionsByDate &&
                    <Grid style={{ marginTop: '7em' }}>
                        <Grid.Column width={16} >
                            {questionsByDate.length === 0 &&
                                <Header sub style={{ marginBottom: '7em' }}>No questions found for this lesson!</Header>
                            }
                        </Grid.Column>
                    </Grid>
                }
            </Fragment>
        </>

    )
})