import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Header } from 'semantic-ui-react';
import { Lesson } from '../../../app/models/lesson';
import { useStore } from '../../../app/stores/store';
import LessonListItem from './LessonListItem';

export default observer(function LessonList() {
    const { lessonStore } = useStore();
    const { lessonsByDate } = lessonStore;

    return (
        <>
            <Fragment>
                <Header sub color='teal'>Lesson List</Header>
                {lessonsByDate.map((lesson: Lesson) => (
                    <LessonListItem key={lesson.id} lesson={lesson} />
                ))}
            </Fragment>
        </>

    )
})