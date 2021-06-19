import { observer } from 'mobx-react-lite';
import React from 'react'
import { Header, Item, Segment, Image } from 'semantic-ui-react'
import { Course } from "../../../app/models/course";
import { format } from 'date-fns';

const courseImageStyle = {
    filter: 'brightness(30%)'
};

const courseImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    course: Course
}

export default observer(function CourseDetailedHeader({ course }: Props) {
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image src={`/assets/categoryImages/film.jpg`} fluid style={courseImageStyle} />
                <Segment style={courseImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={course.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(course.created_at!, 'dd MMM yyyy')}</p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
        </Segment.Group>
    )
})