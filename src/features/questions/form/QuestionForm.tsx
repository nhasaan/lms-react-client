import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { QuestionFormValues } from '../../../app/models/question';

export default observer(function QuestionForm() {
    const history = useHistory();
    const { questionStore } = useStore();
    const { createQuestion, updateQuestion, loadQuestion, loadingInitial } = questionStore;
    const { lessonId } = useParams<{ lessonId: string }>();
    const { id } = useParams<{ id: string }>();

    const [question, setQuestion] = useState<QuestionFormValues>(new QuestionFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The question title is required'),
        a: Yup.string().required('The question option A is required'),
        b: Yup.string().required('The question option B is required'),
        c: Yup.string().required('The question option C is required'),
        d: Yup.string().required('The question option D is required'),
        correct: Yup.string().required('The correct option is required').length(1, 'Max char is one!').oneOf(['a', 'b', 'c', 'd'], 'Any of the a, b, c, d'),
    })

    useEffect(() => {
        if (id) loadQuestion(lessonId, id).then(question => setQuestion(new QuestionFormValues(question)))
    }, [lessonId, id, loadQuestion]);

    function handleFormSubmit(question: QuestionFormValues) {
        if (!question.id) {
            let newQuestion = {
                ...question
            };
            createQuestion(lessonId, newQuestion).then(() => history.push(`/lessonQuestions/${lessonId}`))
        } else {
            updateQuestion(question).then(() => history.push(`/questions/${question.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Loading question...' />

    return (
        <Segment clearing>
            <Header content='Answer Options' sub color='teal' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={question}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Question title' />
                        <MyTextInput name='a' placeholder='Option A' />
                        <MyTextInput name='b' placeholder='Option B' />
                        <MyTextInput name='c' placeholder='Option C' />
                        <MyTextInput name='d' placeholder='Option D' />
                        <MyTextInput name='correct' placeholder='Which one is correct? type a or. b or. c or. d' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} floated='right'
                            positive type='submit' content='Submit' />
                        <Button as={Link} to={`/lessonQuestions/${lessonId}`} floated='left' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>

        </Segment>
    )
})