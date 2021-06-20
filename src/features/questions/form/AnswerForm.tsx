import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Radio, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { AnswerFormValues } from '../../../app/models/answer';
import MyRadioInput from '../../../app/common/form/MyRadioInput';
import { Question } from '../../../app/models/question';

interface Props {
    question: Question
}

export default observer(function AnswerForm({ question }: Props) {
    const history = useHistory();
    const { answerStore } = useStore();
    const { createAnswer, updateAnswer, loadingInitial } = answerStore;
    const { questionId } = useParams<{ questionId: string }>();

    const [answer, setAnswer] = useState<AnswerFormValues>(new AnswerFormValues());

    const validationSchema = Yup.object({
        selected: Yup.string().required('Selecting an answer is required!')
    })

    function handleFormSubmit(answer: AnswerFormValues) {
        if (!answer.id) {
            let newAnswer = {
                ...answer
            };
            createAnswer(questionId, newAnswer).then(() => console.log(newAnswer))
        } else {
            updateAnswer(answer).then(() => history.push(`/answers/${answer.id}`))
        }
    }

    const handleChange = (e: any) => {
        console.log(e)
        console.log(answer)
    }

    if (loadingInitial) return <LoadingComponent content='Loading answer...' />

    return (

        //         _${question.id}
        // _${question.id}
        // _${question.id}
        // _${question.id}
        <>
            <Header content='Answer Options' sub color='teal' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={answer}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <Radio
                            label={question.a}
                            name='selected'
                            value='a'
                            onChange={handleChange}
                            checked={answer.selected === 'a'} />
                        <Radio
                            label={question.b}
                            name='selected'
                            value='b'
                            onChange={handleChange} />
                        <Radio
                            label={question.c}
                            name='selected'
                            value='c'
                            onChange={handleChange} />
                        <Radio
                            label={question.d}
                            name='selected'
                            value='d'
                            onChange={handleChange} />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} floated='right'
                            positive type='submit' content='Submit answer' />
                        Picked: {JSON.stringify(answer)}
                        {/* <Button as={Link} to='/answers' floated='right' type='button' content='Cancel' /> */}
                    </Form>
                )}
            </Formik>
        </>
    )
})