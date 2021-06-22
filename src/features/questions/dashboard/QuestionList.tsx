import React, { Fragment, useState } from 'react';
import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import { Button, Form, Grid, Header, Radio, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Question } from '../../../app/models/question';
import { useStore } from '../../../app/stores/store';
import QuestionListItem from './QuestionListItem';

export default observer(function QuestionList() {
    const { answerStore, userStore, questionStore } = useStore();
    const { questionsByDate } = questionStore;
    const { user } = userStore;
    const { createAnswers, loadingInitial } = answerStore;
    const { lessonId } = useParams<{ lessonId: string }>();
    const [results, setResults] = useState(0);
    const [loading, setLoading] = useState(false)

    function calcResult(answers: any) {
        const corrects = answers.filter((answer: any) => answer.is_correct);
        setResults(corrects.length)
    }

    function handleFormSubmit(values: any) {
        setLoading(true);
        createAnswers(values.answers).then(() => {
            console.log('answer submited saved')
            calcResult(values.answers);
            setLoading(false);
        })
    }
    const userSelections = () => {
        const initialValues = [];
        for (let i = 0; i < questionsByDate.length; i++) {
            const answer = { question_id: questionsByDate[i].id, selected: '', is_correct: false, user_id: user?.id, lesson_id: questionsByDate[i].lesson_id }
            initialValues.push(answer);
        }

        return initialValues;
    }

    const userSelection = { answers: userSelections() };

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
                            {({ values, handleBlur, handleChange, handleSubmit, isSubmitting }) => (
                                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                    {questionsByDate.map((question: Question, index) => (
                                        <Segment.Group key={index}>
                                            <QuestionListItem question={question} />
                                            <Segment attached>
                                                <Radio
                                                    label={question.a}
                                                    id={question.a + index}
                                                    name={`answers[${index}].selected`}
                                                    value='a'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={
                                                        values.answers && values.answers[index]
                                                            ? values.answers[index].selected === 'a'
                                                            : false
                                                    } />
                                            </Segment>
                                            <Segment attached>
                                                <Radio
                                                    label={question.b}
                                                    id={question.b + index}
                                                    name={`answers[${index}].selected`}
                                                    value='b'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={
                                                        values.answers && values.answers[index]
                                                            ? values.answers[index].selected === 'b'
                                                            : false
                                                    } />
                                            </Segment>
                                            <Segment attached>
                                                <Radio
                                                    label={question.c}
                                                    id={question.c + index}
                                                    name={`answers[${index}].selected`}
                                                    value='c'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={
                                                        values.answers && values.answers[index]
                                                            ? values.answers[index].selected === 'c'
                                                            : false
                                                    } />
                                            </Segment>
                                            <Segment attached>
                                                <Radio
                                                    label={question.d}
                                                    id={question.d + index}
                                                    name={`answers[${index}].selected`}
                                                    value='d'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    checked={
                                                        values.answers && values.answers[index]
                                                            ? values.answers[index].selected === 'd'
                                                            : false
                                                    } />
                                            </Segment>
                                            {
                                                values.answers[index].is_correct = (values.answers[index].selected === questionsByDate[index].correct)
                                            }
                                        </Segment.Group>
                                    ))}

                                    <Segment clearing>
                                        <Button
                                            disabled={loading}
                                            loading={loading} floated='right'
                                            positive type='submit' content='Save answer' />
                                    </Segment>
                                </Form>
                            )}
                        </Formik>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Segment clearing>
                            <Header content={'Results: ' + results + ' out of ' + questionsByDate.length + '!'} color='teal' />
                        </Segment>
                    </Grid.Column>
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