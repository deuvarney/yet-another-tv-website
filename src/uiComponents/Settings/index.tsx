import { Bug, KeySquare, LoaderCircle, MessageCircleQuestion, Settings2, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { getCustomTMDB } from '@/services/theMovieDbApi';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import { Label } from '@/components/ui/label';
import { UpdatedCheckbox } from '@/components/ui/checkbox';
import { registerToggleSettingsDialogHandler, unRegisterToggleSettingsDialogHandler } from '@/utils/actionsHander';
import { Link } from 'react-router-dom';
import { updateAPIKey, updateIsHomeFiltersEnabled, updateIsYoutubeEnabled } from '../AppContainer/actionCreators';
import { selectAPIKey, selectIsHomeFiltersEnabled, selectIsYoutubeEnabled } from '../AppContainer/selectors';
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';

export default function Settings() {    
    const dispatch = useAppDispatch();

    const existingAPIKey = useAppSelector(selectAPIKey);
    const isYoutubeVideosEnabled = useAppSelector(selectIsYoutubeEnabled);
    const isHomeFiltersEnabled = useAppSelector(selectIsHomeFiltersEnabled);

    const useVideoId = useId();
    const useHomeFilterId = useId();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error|null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLocallySaved, setIsLocallySaved] = useState(!!existingAPIKey);


    const settingsButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (existingAPIKey && !isLocallySaved) {
            setIsLocallySaved(true);
        } else if (!existingAPIKey && isLocallySaved) {
            setIsLocallySaved(false);
        }
    }, [existingAPIKey])

    function toggleSettingsDialog() {
        if (settingsButtonRef.current) {
            settingsButtonRef.current?.click();
        }
    }

    useEffect(() => {
        registerToggleSettingsDialogHandler(() => toggleSettingsDialog());
        return (() => { unRegisterToggleSettingsDialogHandler(); })
    }, [])

    function onAPIKeyInputDoubleClick(evt: React.MouseEvent<HTMLInputElement>) {
        if (process.env.NODE_ENV === 'development') {
            // In Development, Dynamically import the moviedbapi key and set the value of the input from the event
            import('@/config/apiKeys').then((apiKeysConfig) => {
                const apiKey = apiKeysConfig.movieDbApiKey;
                (evt.target as HTMLInputElement).value = apiKey;
            });
        }
    }

    function onClearClick() {
        dispatch(updateAPIKey(['']));
        localStorage.removeItem('tmdbApiKey');
        setIsSuccess(false);
    }

    function onSubmitClick(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault?.();

        let apiKeyValue;

        if ((evt.target as HTMLFormElement)?.elements) {
            const [input] = (evt.target as HTMLFormElement).elements;
            apiKeyValue = (input as HTMLInputElement).value;
        }

        if (apiKeyValue) {
            setIsLoading(true);
            setError(null);
            setIsSuccess(false);
        } else {
            return;
        }

        // Use the GET configuration call to determine if the key is valid/working
        getCustomTMDB(apiKeyValue).configuration()
            .then((/*res*/) => {
                localStorage.setItem('tmdbApiKey', apiKeyValue);
                dispatch(updateAPIKey([apiKeyValue]));
                setIsSuccess(true);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    function onInteractOutside() {
        if (isSuccess) {
            setIsSuccess(false);
        }
    }

    const onYoutubeEnabledChanged = useCallback((isChecked: boolean) => {
        dispatch(updateIsYoutubeEnabled([isChecked]));
    }, [dispatch]);

    const onHomeFiltersEnabledChanged = useCallback((isChecked: boolean) => {
        dispatch(updateIsHomeFiltersEnabled([isChecked]));
    }, [dispatch]);

    return (
        <TooltipProvider delayDuration={250}>

            <Dialog>
                <DialogTrigger asChild>
                    <Button title='Open Settings' aria-label='Open Settings' ref={settingsButtonRef} className='inline float-right m-2 [&_svg]:w-6 [&_svg]:h-6 mb-0 h-12' >
                        <Settings2 className='' />
                    </Button>
                </DialogTrigger>
                <DialogContent className='w-5/6 min-h-96 max-w-none md:max-w-fit shadow-inner text-xl' onInteractOutside={onInteractOutside}>
                    <DialogHeader>
                        <DialogTitle className='text-3xl text-slate-800 font-bold'>Settings

                        </DialogTitle>
                        {/* <DialogDescription>
                                    Holds the Various Settings for the Application
                                </DialogDescription> */}
                    </DialogHeader>
                    <section className='bg-slate-100 p-4 shadow-md text-slate-800'>
                        <div className='flex'>
                            <KeySquare />
                            <h2 className='ml-2 inline text-2xl pb-4'>TMDB API Key</h2>
                        </div>
                        <div className='mb-4'>
                            <p>In order to use this application, you must have a valid TMDB API Key.</p>
                            <p>You can find instructions on how to get one <a className='underline' target="_blank" rel="noopener noreferrer" href="https://developer.themoviedb.org/v4/docs/getting-started">here</a>.</p>
                            <p className='text-lg text-muted-foreground'>Note: Your key is not sent to the server and will persist in your browser. For detailed information, please read the usage policy <Link className='underline' to="/tos" onClick={toggleSettingsDialog}>here</Link></p>
                        </div>
                        <form className="flex w-full max-w-lg items-center space-x-2" onSubmit={onSubmitClick}>
                            <Input onDoubleClick={onAPIKeyInputDoubleClick} disabled={!!isLocallySaved} type="password" placeholder={isLocallySaved ? '(Unchanged)' : "TMDB API Key"} />
                            {error && <p className='text-red-600'>Error occurred: {error.message}</p>}
                            {isSuccess && <p className='text-green-600'>Success!</p>}
                            <Button type="submit" disabled={isLoading || !!isLocallySaved}>Submit
                                {isLoading && <LoaderCircle className='animate-spin' />}
                            </Button>
                            <Button variant="destructive" disabled={!isLocallySaved} onClick={onClearClick}>Remove</Button>
                        </form>
                    </section>
                    <section className='bg-slate-100 p-4 shadow-md text-slate-800'>
                        <div className='flex'>

                            <Youtube />
                            <h2 className='ml-2 inline text-2xl pb-4'>Youtube Integration</h2>
                        </div>
                        <div className='flex items-center'>
                            <Label className="mr-2 text-xl" htmlFor={useVideoId}>Enable Videos</Label>
                            <UpdatedCheckbox id={useVideoId} defaultChecked={isYoutubeVideosEnabled} onCheckedChange={onYoutubeEnabledChanged} />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    {/* TODO: Figure out touchscreen solution */}
                                    <MessageCircleQuestion tabIndex={0} className='text-muted-foreground ml-4' />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className='text-xl'>Enabling this feature will allow you to view the trailer for a movie or tv show in the video player</p>
                                    <p className='text-lg text-muted-foreground'>Note: Enabling this may introduce cookies to your browser from Youtube (and its affiliates)</p>
                                </TooltipContent>
                            </Tooltip>

                        </div>
                    </section>

                    <section className='bg-slate-300 p-4 shadow-md text-slate-800'>
                        <div className='flex'>

                            <Bug />
                            <h2 className='ml-2 inline text-2xl pb-4'>Development/Experiments</h2>
                        </div>
                        <div className='flex items-center'>
                            <Label className="mr-2 text-xl" htmlFor={useHomeFilterId}>Enable Home Filters</Label>
                            <UpdatedCheckbox id={useHomeFilterId} defaultChecked={isHomeFiltersEnabled} onCheckedChange={onHomeFiltersEnabledChanged} />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    {/* TODO: Figure out touchscreen solution */}
                                    <MessageCircleQuestion tabIndex={0} className='text-muted-foreground ml-4'/>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className='text-xl'>Enabling this feature will allow you to filter items on the homepage</p>
                                    <p className='text-lg text-muted-foreground'>Note: Implementation is not complete and visual anomaliies may occur</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </section>
                    {/* <DialogFooter>
                                <Button type="submit">Confirm</Button>
                            </DialogFooter> */}
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}