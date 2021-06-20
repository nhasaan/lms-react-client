import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Header, Segment, SegmentGroup } from 'semantic-ui-react';
import { Question } from '../../../app/models/question';
import { useStore } from '../../../app/stores/store';
import AnswerForm from '../form/AnswerForm';
import QuestionListItem from './QuestionListItem';

export default observer(function QuestionList() {
    const { questionStore } = useStore();
    const { questionsByDate } = questionStore;

    return (
        <>
            <Fragment>
                <Header sub color='teal'>Question List</Header>
                {questionsByDate.map((question: Question) => (
                    <>
                        <QuestionListItem key={question.id} question={question} />
                    </>
                ))}
            </Fragment>
        </>

    )
})