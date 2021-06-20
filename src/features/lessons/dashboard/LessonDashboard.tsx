import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from 'react-router-dom';
import { Grid, Loader } from 'semantic-ui-react';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import LessonList from './LessonList';
import LessonListItemPlaceholder from './LessonListItemPlaceholder';

export default observer(function LessonDashboard() {
    const { lessonStore } = useStore();
    const { loadLessons, loadSelectedCourseId, lessonRegistry, setPagingParams, pagination } = lessonStore;
    const [loadingNext, setLoadingNext] = useState(false);
    const { courseId } = useParams<{ courseId: string }>();

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadLessons(courseId).then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if (courseId) loadSelectedCourseId(courseId)
        if (lessonRegistry.size <= 1) loadLessons(courseId);
    }, [lessonRegistry.size, loadLessons, courseId, loadSelectedCourseId])

    return (
        <Grid>
            <Grid.Column width='10'>
                {lessonStore.loadingInitial && !loadingNext ? (
                    <>
                        <LessonListItemPlaceholder />
                        <LessonListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <LessonList />
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