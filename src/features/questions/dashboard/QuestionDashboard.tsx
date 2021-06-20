import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { Grid, Loader } from 'semantic-ui-react';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import QuestionList from './QuestionList';
import QuestionListItemPlaceholder from './QuestionListItemPlaceholder';

export default observer(function QuestionDashboard() {
    const { questionStore } = useStore();
    const { loadQuestions, loadSelectedLessonId, questionRegistry, setPagingParams, pagination } = questionStore;
    const [loadingNext, setLoadingNext] = useState(false);
    const { lessonId } = useParams<{ lessonId: string }>();

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadQuestions(lessonId).then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if (lessonId) loadSelectedLessonId(lessonId)
        if (questionRegistry.size <= 1) loadQuestions(lessonId);
    }, [questionRegistry.size, loadQuestions, lessonId, loadSelectedLessonId])

    return (
        <Grid>
            <Grid.Column width='10'>
                {questionStore.loadingInitial && !loadingNext ? (
                    <>
                        <QuestionListItemPlaceholder />
                        <QuestionListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <QuestionList />
                    </InfiniteScroll>
                )}
            </Grid.Column>
            <Grid.Column width='6'>
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})