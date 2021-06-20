import { observer } from 'mobx-react-lite';
import React from 'react'
import { Header, Item, Segment, Image } from 'semantic-ui-react'
import { Lesson } from "../../../app/models/lesson";
import { format } from 'date-fns';

const lessonImageStyle = {
    filter: 'brightness(30%)'
};

const lessonImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    lesson: Lesson
}

export default observer(function LessonDetailedHeader({ lesson }: Props) {
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image src={`/assets/categoryImages/film.jpg`} fluid style={lessonImageStyle} />
                <Segment style={lessonImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={lesson.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(new Date(lesson.created_at!), 'dd MMM yyyy')}</p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
        </Segment.Group>
    )
})