import { observer } from 'mobx-react-lite';
import React from 'react'
import { Header, Item, Segment, Image } from 'semantic-ui-react'
import { Question } from "../../../app/models/question";
import { format } from 'date-fns';

const questionImageStyle = {
    filter: 'brightness(30%)'
};

const questionImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    question: Question
}

export default observer(function QuestionDetailedHeader({ question }: Props) {
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image src={`/assets/categoryImages/film.jpg`} fluid style={questionImageStyle} />
                <Segment style={questionImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={question.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(new Date(question.created_at!), 'dd MMM yyyy')}</p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
        </Segment.Group>
    )
})