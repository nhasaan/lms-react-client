import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
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
        description: Yup.string().required('The question description is required')
    })

    useEffect(() => {
        if (id) loadQuestion(lessonId, id).then(question => setQuestion(new QuestionFormValues(question)))
    }, [lessonId, id, loadQuestion]);

    function handleFormSubmit(question: QuestionFormValues) {
        if (!question.id) {
            let newQuestion = {
                ...question
            };
            createQuestion(newQuestion).then(() => history.push(`/questions`))
        } else {
            updateQuestion(question).then(() => history.push(`/questions/${question.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Loading question...' />

    return (
        <Segment clearing>
            <Header content='Question Details' sub color='teal' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={question}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} floated='right'
                            positive type='submit' content='Submit' />
                        <Button as={Link} to='/questions' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>

        </Segment>
    )
})