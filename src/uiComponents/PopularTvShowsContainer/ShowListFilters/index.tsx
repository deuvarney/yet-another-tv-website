import { Label } from "@/components/ui/label";
import { UpdatedCheckbox } from "@/components/ui/checkbox"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


import { useAppDispatch, useAppSelector } from '@/hooks/redux';


import {
    selectAvailableOriginCountries,
    selectSetOriginCountriesFilter,
    selectAvailableOriginLanguages,
    selectSetOriginalLanguagesFilter,
    selectAvailableGenreIds,
    selectSetGenresFilter
} from '../selectors';
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { updateOriginalLanguagesFilter, updateOriginCountriesFilter, updateGenresFilter } from "../actionCreators";
import { genreIdMapping } from "@/constants/tvGenreMappings";
import { Filter } from "lucide-react";

// Create function to determine if the values in 2 sets are the same
function areSetsEqual(set1: Set<string>, set2: Set<string>) {
    if (set1.size !== set2.size) {
        return false;
    }
    for (const item of set1) {
        if (!set2.has(item)) {
            return false;
        }
    }
    return true;
}


interface ListFilterContentProps {
    title: string;
    listSet: Set<string>;
    activeItems?: Set<string>;
    onApply: (activeItems: Set<string>) => void;
}

function PopoverContentListFilter(props: ListFilterContentProps) {

    const [updatedActiveItems, setUpdatedActiveItems] = useState(new Set<string>(props.activeItems));
    const filtersListCont = useRef(null);
    const [clearDisabled, setClearDisabled] = useState(props.activeItems?.size === 0);
    const [isApplyDisabled, setApplyDisabled] = useState(true);


     useEffect(() => {
        if (areSetsEqual(updatedActiveItems, props.activeItems || new Set())) {
            if(!isApplyDisabled) {
                setApplyDisabled(true);
            }
        } else {
            if(isApplyDisabled) {
                setApplyDisabled(false);
            }
        }
    }, [updatedActiveItems, props.activeItems]);

    useEffect(() => {
        // console.log('processing clear shiz')
        if (updatedActiveItems.size && clearDisabled) {
            setClearDisabled(false);
        } else if (!updatedActiveItems.size && !clearDisabled) {
            setClearDisabled(true);
        }
    }, [updatedActiveItems]);


    function handleCheckboxChange(isChecked: boolean|string, item: string) {
        const activeItems = new Set(updatedActiveItems);

        if (isChecked && !activeItems.has(item)) {
            activeItems.add(item);
        } else if (!isChecked && activeItems.has(item)) {
            activeItems.delete(item);
        }

        setUpdatedActiveItems(activeItems);
    }

    function onApply() {
        console.log('##On apply clicked', updatedActiveItems)
        props.onApply(updatedActiveItems);
        // setApplyDisabled(true);
    }

    function resetLocalUpdatedActiveItems() {
        if(!areSetsEqual(updatedActiveItems, props.activeItems || new Set())) {
            console.log('###resetLocalUpdatedActiveItems', props.activeItems)
            setUpdatedActiveItems(new Set(props.activeItems || []));
        }

    }

    function onClear() {
        console.log('###onClear called')
        Array.from(props.listSet).forEach((item) => {
            // Get an element by id:
            const element = document.getElementById(`terms-${item}`);
            if (element && element.getAttribute('data-state') === 'checked') {
                element.click();
            }
        })
        setUpdatedActiveItems(new Set());

    }

    return (
        <PopoverContent className="flex flex-col bg-gray-800 w-[36rem] max-h-[75dvh]" onInteractOutside={resetLocalUpdatedActiveItems}>
            <h3 className="text-4xl text-neutral-100">{props.title}</h3>
            <ul ref={filtersListCont} className="overflow-y-auto bg-gray-700 px-2 rounded-lg my-4">
                {!!props.listSet?.size && Array.from(props.listSet).map((item, idx, arr) => (
                    <>
                        <li className="flex items-center space-x-2 content-center py-3">
                            <UpdatedCheckbox id={`terms-${item}`} defaultChecked={props.activeItems?.has(item)} onCheckedChange={(evt) => handleCheckboxChange(evt, item)} />
                            <Label className="ml-0 mt-0 text-neutral-50 text-xl grow pl-3" htmlFor={`terms-${item}`}>{item}</Label>
                        </li>
                        {idx !== arr.length - 1 && <hr />}
                    </>
                ))}
            </ul>
            <div>
                <Button className="text-2xl mx-4 px-10 py-6" disabled={isApplyDisabled} onClick={() => onApply()}>Apply</Button>
                <Button className="text-2xl mx-4 px-10 py-6" disabled={clearDisabled} onClick={() => onClear()}>Clear</Button>
            </div>
        </PopoverContent>
    );
}

interface ShowListFilterOptionProps {
    title: string;
    activeCount: number;
    children: React.ReactNode;
}

function ShowListFilterOption(props: ShowListFilterOptionProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="relative text-2xl px-6 py-6 mx-6">{props.title}
                    {!!props.activeCount && <sup className="absolute top-2 right-0.5 text-cyan-700">{props.activeCount}</sup>}
                </Button>
            </PopoverTrigger>
            {props.children}
        </Popover>
    );
}

function ShowListFilters(/*props*/) {
    const availableOriginCountries = useAppSelector(selectAvailableOriginCountries);
    const setOriginCountries = useAppSelector(selectSetOriginCountriesFilter);

    const availableOriginLanguages = useAppSelector(selectAvailableOriginLanguages);
    const setOriginalLanguages = useAppSelector(selectSetOriginalLanguagesFilter);

    const availableGenreIds = useAppSelector(selectAvailableGenreIds);
    const setGenreIds = useAppSelector(selectSetGenresFilter);

    const mappedAvailableGenreIds = new Set(Array.from(availableGenreIds).map((id) => genreIdMapping[id] || id));
    const mappedSetGenreIds = new Set(Array.from(setGenreIds).map((id) => genreIdMapping[id]));

    // console.log('### mappedSetGenreIds', mappedSetGenreIds);
    const dispatch = useAppDispatch();


    function onCountryFilterApply(activeItems: Set<string>) {
        dispatch(updateOriginCountriesFilter(activeItems));
    }

    function onOriginalLanguagesApply(activeItems: Set<string>) {
        dispatch(updateOriginalLanguagesFilter(activeItems));
    }

    function onGenresApply(activeItems: Set<string>) {
        const unmappedActiveItems = Array.from(activeItems).map(
            (stringVal) => {
                const [key] = Object.entries(genreIdMapping).find(([ , val]) => val === stringVal) || [];
                return key;
            }
        ).filter(n => n !== undefined);
        // console.log('### unmappedActiveItems', unmappedActiveItems);
        dispatch(updateGenresFilter(new Set(unmappedActiveItems)));
    }

    return (
        <div>
            <Filter className="inline mx-4"/>

            <ShowListFilterOption title="Origin Country" activeCount={setOriginCountries.size}>
                <PopoverContentListFilter title="Origin Country Filter" listSet={availableOriginCountries} activeItems={setOriginCountries} onApply={onCountryFilterApply} />
            </ShowListFilterOption>

            <ShowListFilterOption title="Origin Language" activeCount={setOriginalLanguages.size}>
                <PopoverContentListFilter title="Origin Language Filter" listSet={availableOriginLanguages} activeItems={setOriginalLanguages} onApply={onOriginalLanguagesApply} />
            </ShowListFilterOption>

            <ShowListFilterOption title="Genres" activeCount={mappedSetGenreIds.size}>
                <PopoverContentListFilter title="Genre Filter" listSet={mappedAvailableGenreIds} activeItems={mappedSetGenreIds} onApply={onGenresApply} />
            </ShowListFilterOption>

        </div>
    );
}


export default ShowListFilters;