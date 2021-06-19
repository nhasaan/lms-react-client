import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid, Loader } from 'semantic-ui-react';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import CourseList from './CourseList';
import CourseListItemPlaceholder from './CourseListItemPlaceholder';

export default observer(function CourseDashboard() {
    const { courseStore } = useStore();
    const { loadCourses, courseRegistry, setPagingParams, pagination } = courseStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1))
        loadCourses().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if (courseRegistry.size <= 1) loadCourses();
    }, [courseRegistry.size, loadCourses])

    return (
        <Grid>
            <Grid.Column width='10'>
                {courseStore.loadingInitial && !loadingNext ? (
                    <>
                        <CourseListItemPlaceholder />
                        <CourseListItemPlaceholder />
                    </>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <CourseList />
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