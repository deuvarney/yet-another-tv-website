import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import './styles.scss';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Video } from "@/modules/moviedb-promise-main/dist";

interface VideoDialogListProps {
    videos: Video[];
}

export default function VideoDialogList(props: VideoDialogListProps) {

    return (
        <div className="VideoDialogList-cont">
            {
                (props.videos || []).filter((video) => video.iso_639_1 === 'en').map((video, idx) => {
                    return (
                        <Dialog>
                            <DialogTrigger style={{ maxWidth: '100%' }} className="VideoDialogList-item-trigger" tabIndex={0}>
                                <AspectRatio className="VideoDialogList-item-iframe-cont" ratio={16 / 9}>
                                    <iframe
                                        className="VideoDialogList-item-iframe"
                                        src={`https://www.youtube.com/embed/${video.key}${idx === 0 ? '?autoplay=1&mute=1' : ''}`}
                                        title={video.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        // TODO: Set this to no referrer
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        style={{ pointerEvents: 'none' }}
                                        tabIndex={-1}
                                    />
                                </AspectRatio>
                                <p className="VideoDialogList-item-Tagline">{video.name}</p>

                                {/* </div> */}
                            </DialogTrigger>
                            <DialogContent className="VideoDialogList-content">

                                <DialogHeader>
                                    <DialogTitle className="VideoDialogList-content-title">{video.name}</DialogTitle>
                                    <DialogDescription className="VideoDialogList-content-description">
                                        {video.type} | {video.site}
                                    </DialogDescription>
                                </DialogHeader>

                                <AspectRatio ratio={16 / 9}>
                                    <iframe
                                        className="VideoDialogList-content-iframe"
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${video.key}?autoplay=1&mute=0`}
                                        title={video.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        // TODO: Set this to no referrer
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    // style={{ pointerEvents: 'none' }}
                                    // tabIndex={-1}
                                    />
                                </AspectRatio>

                            </DialogContent>
                        </Dialog>

                    );
                })
            }
        </div>
    );
}