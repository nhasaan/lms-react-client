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
import { Lesson, LessonFormValues } from '../../../app/models/lesson';

export default observer(function LessonForm() {
    const history = useHistory();
    const { lessonStore } = useStore();
    const { createLesson, updateLesson, loadLesson, loadingInitial, selectedLesson } = lessonStore;
    const { courseId } = useParams<{ courseId: string }>();
    const { id } = useParams<{ id: string }>();

    const [lesson, setLesson] = useState<LessonFormValues>(new LessonFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The lesson title is required'),
        description: Yup.string().required('The lesson description is required')
    })

    useEffect(() => {
        if (id) loadLesson(courseId, id).then(lesson => setLesson(new LessonFormValues(lesson)))
    }, [courseId, id, loadLesson]);

    function handleFormSubmit(lesson: LessonFormValues) {
        if (!lesson.id) {
            let newLesson = {
                ...lesson
            };
            createLesson(newLesson).then(() => history.push(`/lessons`))
        } else {
            updateLesson(lesson).then(() => history.push(`/lessons/${lesson.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Loading lesson...' />

    return (
        <Segment clearing>
            <Header content='Lesson Details' sub color='teal' />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={lesson}
                onSubmit={values => handleFormSubmit(values)}>
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} floated='right'
                            positive type='submit' content='Submit' />
                        <Button as={Link} to='/lessons' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>

        </Segment>
    )
})