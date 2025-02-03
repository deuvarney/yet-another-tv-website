import { Video } from "@/modules/moviedb-promise-main/dist";
import ContentContainer, { ContextContainerText_H2 } from "../base/ContentContainer";
import VideoDialogList from "../base/VideoDialogList";

interface VideosDialogListContentProps {
    videos: Video[];
    title: string;
  }

export default function VideosDialogListContent(props: VideosDialogListContentProps) {
    const {videos = [], title} = props;
    if(!videos.length){return null;}
    return (
        <ContentContainer>
            <ContextContainerText_H2>{title}</ContextContainerText_H2>
            <VideoDialogList videos={videos} />
        </ContentContainer>
    )
}