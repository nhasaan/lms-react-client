import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Header, Radio, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AnswerFormValues } from '../../../app/models/answer';
import { Question } from '../../../app/models/question';

interface Props {
    question: Question
}

export default observer(function AnswerForm({ question }: Props) {
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

    function handleFormSubmit(answer: AnswerFormValues) {
        if (!answer.id) {
            let newAnswer = {
                ...answer
            };
            createAnswer(questionId, newAnswer).then(() => history.push(`/lessonQuestions/${question.lesson_id}`))
        } else {
            updateAnswer(answer).then(() => history.push(`/answers/${answer.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Loading answer...' />

    return (
        <>
            <Header content='Answer Options' sub color='teal' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={answer}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, values, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <Segment clearing>
                            <Radio
                                label={question.a}
                                name='selected'
                                value='a'
                                checked={values.selected === 'a'} />
                            <Radio
                                label={question.b}
                                name='selected'
                                value='b'
                                checked={values.selected === 'b'} />
                            <Radio
                                label={question.c}
                                name='selected'
                                value='c'
                                checked={values.selected === 'c'} />
                            <Radio
                                label={question.d}
                                name='selected'
                                value='d'
                                checked={values.selected === 'd'} />
                        </Segment>
                        <Segment clearing>
                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={isSubmitting} floated='right'
                                positive type='submit' content='Save answer' />
                        </Segment>
                    </Form>
                )}
            </Formik>
        </>
    )
})