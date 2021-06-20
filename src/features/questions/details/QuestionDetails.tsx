import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import QuestionDetailedInfo from './QuestionDetailedInfo';
import QuestionDetailedHeader from './QuestionDetaledHeader';

export default observer(function QuestionDetails() {
    const { questionStore } = useStore();
    const { selectedQuestion: question, loadQuestion, loadingInitial, clearSelectedQuestion } = questionStore;
    const { lessonId } = useParams<{ lessonId: string }>();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id && lessonId) loadQuestion(lessonId, id);
        return () => clearSelectedQuestion();
    }, [id, lessonId, loadQuestion, clearSelectedQuestion]);

    if (loadingInitial || !question) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <QuestionDetailedHeader question={question} />
                <QuestionDetailedInfo question={question} />
            </Grid.Column>
            <Grid.Column width={6}>
            </Grid.Column>
        </Grid>
    )
})