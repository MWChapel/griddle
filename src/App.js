/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-vars */
import './App.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useEffect, useRef, useState } from 'react';
import ReactDice from 'react-dice-complete';
import 'react-dice-complete/dist/react-dice-complete.css';
import _ from 'lodash';
import LightModeIcon from '@mui/icons-material/LightMode';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import WestIcon from '@mui/icons-material/West';
import NorthIcon from '@mui/icons-material/North';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';
import { createStyles, makeStyles } from '@mui/styles';

import {
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
} from './lib/localStorage'
import { North } from '@mui/icons-material';

const useStyles = makeStyles((theme) =>
  createStyles({
    rotateBox: {

    },
    unselectedItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        backgroundColor: theme.palette.mode === 'light' ? '#0D63CC' : '#0D63CC',
        borderRadius: theme.spacing(1),
        textAlign: 'center',
        color: 'white',
        cursor: 'pointer',
      },
      selectedItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        backgroundColor: theme.palette.mode === 'light' ? '#c00851' : '#c00851',
        borderRadius: theme.spacing(1),
        textAlign: 'center',
        color: 'white',
      },
      completedItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        backgroundColor: theme.palette.mode === 'light' ? '#ffa600' : '#ffa600',
        borderRadius: theme.spacing(1),
        textAlign: 'center',
        color: 'white'
      },
      doublerItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        backgroundColor: theme.palette.mode === 'light' ? '#49b8ff' : '#49b8ff',
        borderRadius: theme.spacing(1),
        textAlign: 'center',
        color: 'white',
        border: `4px solid ${theme.palette.mode === 'light' ? '#ffa600' : '#ffa600'}`
      },
      completedDiagItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        backgroundColor: theme.palette.mode === 'light' ? '#f2522e' : '#f2522e',
        ...theme.typography.body2,
        borderRadius: theme.spacing(1),
        textAlign: 'center',
        color: 'white',
      },
      scoreBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        backgroundColor: theme.palette.mode === 'light' ? '#B3B5BD' : '#5B5D6B',
        borderRadius: theme.spacing(1),
        textAlign: 'center',
        color: 'white',
      },
      diceBox: {
        margin: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        borderRadius: theme.spacing(1),
        border: `2px solid ${theme.palette.mode === 'light' ? '#B3B5BD' : '#5B5D6B'}`
      },
      rollButton: {
        height: theme.spacing(12),
        width: theme.spacing(12),
      }
  }),
);

const Game = ({ handleDarkMode }) => {
    let rollDice1 = useRef(null);
    let rollDice2 = useRef(null);
    const classes = useStyles();
    const emptyPayload = [
        {item: 0, row:1, col:1, diag:1, value:0},
        {item: 1, row:1, col:2, diag:0, value:0},
        {item: 2, row:1, col:3, diag:0, value:0},
        {item: 3, row:1, col:4, diag:0, value:0},
        {item: 4, row:1, col:5, diag:2, value:0},
        {item: 5, row:2, col:1, diag:0, value:0},
        {item: 6, row:2, col:2, diag:1, value:0},
        {item: 7, row:2, col:3, diag:0, value:0},
        {item: 8, row:2, col:4, diag:2, value:0},
        {item: 9, row:2, col:5, diag:0, value:0},
        {item: 10, row:3, col:1, diag:0, value:0},
        {item: 11, row:3, col:2, diag:0, value:0},
        {item: 12, row:3, col:3, diag:3, value:0},
        {item: 13, row:3, col:4, diag:0, value:0},
        {item: 14, row:3, col:5, diag:0, value:0},
        {item: 15, row:4, col:1, diag:0, value:0},
        {item: 16, row:4, col:2, diag:2, value:0},
        {item: 17, row:4, col:3, diag:0, value:0},
        {item: 18, row:4, col:4, diag:1, value:0},
        {item: 19, row:4, col:5, diag:0, value:0},
        {item: 20, row:5, col:1, diag:2, value:0},
        {item: 21, row:5, col:2, diag:0, value:0},
        {item: 22, row:5, col:3, diag:0, value:0},
        {item: 23, row:5, col:4, diag:0, value:0},
        {item: 24, row:5, col:5, diag:1, value:0}
    ];
    const [successAlert, setSuccessAlert] = useState('');
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [open, setOpen] = useState(false);
    const [hasRolled, setHasRolled]= useState(false);
    const [hasSelected, setHasSelected]= useState(false);
    const [diceValues, setDiceValues] = useState({});
    const [payload, setPayload]= useState(emptyPayload);
    const ALERT_TIME_MS = 2000;
    const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches

    const handleClose = () => {
        setOpen(false);
    };

    const rollDoneCallback = (num, dice) => {
        diceValues[dice] = num;
        setDiceValues({...diceValues});
      }

    const hands=[{ hand: "4 of a Kind", score: 6}, {}, { hand: "Straight", score: 4}, {}, {hand: "High Card", score: 0},
    { hand: "1 Pair", score: 1}, {hand: "2 Pair", score: 2}, {}, {hand: "3 of a Kind", score: 3}, {hand: "Full House", score: 5} ];
 
    //Calculates the Rank of a 5 card Poker hand using bit manipulations.
    const rankPokerHand = (cs = []) => {
        const multiplier = cs.filter(val => val === 2 || val === 12)?.length + 1 || 0;

        if(cs.every( (val, i, arr) => val === arr[0] )) {
            return {
                hand: '5 of a kind',
                score: multiplier > 0 ? 10 * multiplier : 10
            }
        }
        let v, i, o, s = 1<<cs[0]|1<<cs[1]|1<<cs[2]|1<<cs[3]|1<<cs[4];
        for (i=-1, v=o=0; i<5; i++, o=Math.pow(2,cs[i]*4)) {v += o*((v/o&15)+1);}
        v = v % 15 - ((s/(s&-s) === 31) || (s === 0x403c) ? 3 : 1);
        let hand = hands[v];
        if(multiplier > 0) {
            hand.score = hand.score * multiplier;
        }
        return hand;
    }

    const getScore = () => {
        const score = scoreCol(1)?.score + scoreCol(2)?.score + scoreCol(3)?.score + scoreCol(4)?.score + scoreCol(5)?.score +
        scoreRow(1)?.score + scoreRow(2)?.score + scoreRow(3)?.score + scoreRow(4)?.score + scoreRow(5)?.score +
        scoreDiag(1)?.score + scoreDiag(2)?.score;
        return score || 0;
    }

    // Rolls all the dice
    const rollAll = () => {
        rollDice1.rollAll()
        rollDice2.rollAll()
        setHasRolled(true);
        setHasSelected(false);
    }

    const selectItem = (item) => {
        if(hasSelected || !hasRolled || isGameOver) {
            return;
        }
        const value = diceValues[1] + diceValues[2];
        const array = Array.from(payload);
        array[item].value = value;
        setPayload(array);
        setHasSelected(true);
        if(!payload.find((item) => item.value === 0)) {
            if(!open) {
                setOpen(true);
            }
            setIsGameOver(true);
        }
    }

    const rowColumnComplete = (itemNum) => {
        const row = payload[itemNum].row;
        if(!payload.find((item) => item.row === row && item.value === 0)) {
            return true;
        }
        const column = payload[itemNum].col;
        if(!payload.find((item) => item.col === column && item.value === 0)) {
            return true;
        }
       return false;
    }

    const scoreDiag = (itemNum) => {
        const middle = payload[12].value
        if(middle > 0 && !payload.find((item) => item.diag === itemNum && item.value === 0)) {
            const items = payload.filter((item) => item.diag === itemNum);
            const valArray = items?.map((entry) => {
                return parseInt(entry?.value);
            });
            valArray.push(parseInt(middle));
            return rankPokerHand(valArray);
        }
        return {score: 0};
    }

    const scoreRow = (itemNum) => {
        if(!payload.find((item) => item.row === itemNum && item.value === 0)) {
            const items = payload.filter((item) => item.row === itemNum);
            const valArray = items?.map((entry) => {
                return parseInt(entry?.value);
            });
            return rankPokerHand(valArray);
        }
        return {score: 0};
    }

    const scoreCol = (itemNum) => {
        if(!payload.find((item) => item.col === itemNum && item.value === 0)) {
            const items = payload.filter((item) => item.col === itemNum);
            const valArray = items?.map((entry) => {
                return parseInt(entry?.value);
            });
            return rankPokerHand(valArray);
        }
        return {score: 0};
    }

    const diagComplete = (itemNum) => {
        const diag = payload[itemNum].diag;
        const middle = payload[12].value
        if(diag > 0 && middle > 0 && !payload.find((item) => item.diag === 1 && item.value === 0) && !payload.find((item) => item.diag === 2 && item.value === 0)) {
            return true;
        }
        if(diag > 0 && itemNum !== 12 && !payload.find((item) => item.diag === diag && item.value === 0)) {
            return true;
        }
       return false;
    }
    const selectClass = (item) => {
        const val = payload[item].value;
        if(parseInt(val) === 2 || parseInt(val) === 12) {
            return classes.doublerItem;
        }
        if(diagComplete(item)) {
            return classes.completedDiagItem;
        }
        if(rowColumnComplete(item)) {
            return classes.completedItem;
        }
        if(payload[item].value > 0) {
            return classes.selectedItem;
        }
        return classes.unselectedItem;
    }

    const resetGame = () => {
        setPayload(emptyPayload);
        setHasRolled(false);
        setHasSelected(false);
        setIsGameOver(false);
    }


    //Roll all dice for the next round
    useEffect(() => {
        if (!hasRolled) {
            rollAll()
        }
    }, [hasRolled])

    const Blank = styled(Box)(({ theme }) => ({
        height: '35px'
    }));

    return (
        <Box 
            justifyContent="center"
            flexDirection="column"
            display="flex"
            alignItems="center"
            flexGrow={1}
        >
            <Box 
                display="flex" 
                justifyContent="center"
                alignItems="center"
                width={450}
            >
                <Box p={1}>
                    <Box>
                    GRIDDLE!
                    </Box>
                    <Box>
                        <div>by Richard Garfield</div>
                    </Box>
                </Box>
                <Box marginLeft="auto">
                    <LightModeIcon
                        onClick={() => handleDarkMode()}
                    />
                    <InfoIcon
                        onClick={() => setIsInfoModalOpen(true)}
                    />
                    <BarChartIcon
                        onClick={() => setIsStatsModalOpen(true)}
                    />
                </Box>
            </Box>
            <Box 
                display="flex" 
                width={450}
                justifyContent="center"
                alignItems="center">
                <Box pr={2}>
                    <Button className={classes.rollButton} disabled={!hasSelected || isGameOver} onClick={rollAll} color="warning" variant="contained">{hasSelected ? "ROLL!" : "Select"}</Button>
                </Box>
                <Box className={classes.diceBox}>
                    <ReactDice
                        numDice={1}
                        dieSize={60}
                        margin={8}
                        faceColor={'#00B95F'}
                        dotColor={`#ffffff`}
                        rollTime={1}
                        disableIndividual
                        rollDone={(value) => rollDoneCallback(value, 1)}
                        ref={dice => rollDice1 = dice}
                    />
                </Box>
                <Box className={classes.diceBox}>
                    <ReactDice
                        numDice={1}
                        dieSize={60}
                        margin={8}
                        faceColor={'#00B95F'}
                        dotColor={`#ffffff`}
                        rollTime={1}
                        disableIndividual
                        rollDone={(value) => rollDoneCallback(value, 2)}
                        ref={dice => rollDice2 = dice}
                    />
                </Box>
            </Box>
            <Box
                display="flex" 
                width={450}
                justifyContent="center"
                alignItems="center"
            >
                <Grid container spacing={1}>
                    <Grid item xs={9.17}>
                        <Blank></Blank>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" alignItems="center" justifyItems="center" paddingRight={1} height='100%'>
                            <CallReceivedIcon fontSize="small"/>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box className={classes.scoreBox}>
                            <Typography variant="h5">{scoreDiag(2)?.score}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box onClick={() => selectItem(0)} className={selectClass(0)}>
                            {payload[0].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[0].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(1)} className={selectClass(1)}>
                            {payload[1].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[1].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(2)} className={selectClass(2)}>
                            {payload[2].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[2].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(3)} className={selectClass(3)}>
                            {payload[3].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[3].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(4)} className={selectClass(4)}>
                            {payload[4].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[4].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" alignItems="center" justifyItems="center" paddingRight={1} height='100%'>
                            <WestIcon fontSize="small"/>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box className={classes.scoreBox}>
                            <Typography variant="h5">{scoreRow(1)?.score}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(5)} className={selectClass(5)}>
                            {payload[5].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[5].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(6)} className={selectClass(6)}>
                            {payload[6].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[6].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(7)} className={selectClass(7)}>
                            {payload[7].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[7].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(8)} className={selectClass(8)}>
                            {payload[8].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[8].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(9)} className={selectClass(9)}>
                            {payload[9].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[9].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" alignItems="center" justifyItems="center" paddingRight={1} height='100%'>
                            <WestIcon fontSize="small"/>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box className={classes.scoreBox}>
                            <Typography variant="h5">{scoreRow(2)?.score}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(10)} className={selectClass(10)}>
                            {payload[10].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[10].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(11)}  className={selectClass(11)}>
                            {payload[11].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[11].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(12)} className={selectClass(12)}>
                            {payload[12].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[12].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(13)} className={selectClass(13)}>
                            {payload[13].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[13].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(14)} className={selectClass(14)}>
                            {payload[14].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[14].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" alignItems="center" justifyItems="center" paddingRight={1} height='100%'>
                            <WestIcon fontSize="small"/>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box className={classes.scoreBox}>
                            <Typography variant="h5">{scoreRow(3)?.score}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(15)} className={selectClass(15)}>
                            {payload[15].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[15].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(16)} className={selectClass(16)}>
                            {payload[16].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[16].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(17)} className={selectClass(17)}>
                            {payload[17].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[17].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(18)} className={selectClass(18)}>
                            {payload[18].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[18].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(19)} className={selectClass(19)}>
                            {payload[19].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[19].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" alignItems="center" justifyItems="center" paddingRight={1} height='100%'>
                            <WestIcon fontSize="small"/>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box  className={classes.scoreBox}>
                            <Typography variant="h5">{scoreRow(4)?.score}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(20)} className={selectClass(20)}>
                            {payload[20].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[20].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(21)} className={selectClass(21)}>
                            {payload[21].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[21].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(22)} className={selectClass(22)}>
                            {payload[22].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[22].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(23)} className={selectClass(23)}>
                            {payload[23].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[23].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box onClick={() => selectItem(24)} className={selectClass(24)}>
                            {payload[24].value > 0 ? (
                                <Box>
                                    <Typography variant="h4">{payload[24].value}</Typography>
                                </Box>
                            ) : (
                                <StarIcon />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box display="flex" alignItems="center" justifyItems="center" paddingRight={1} height='100%'>
                            <WestIcon fontSize="small"/>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box  className={classes.scoreBox}>
                            <Typography variant="h5">{scoreRow(5)?.score}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box display="flex" alignItems="center" justifyItems="center" width="100%">
                            <Box width="100%" textAlign="center">
                                <NorthIcon fontSize="small"/>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box display="flex" className={classes.rotateBox} alignItems="center" justifyItems="center" width="100%">
                            <Box width="100%" textAlign="center">
                                <NorthIcon fontSize="small"/>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box display="flex" className={classes.rotateBox} alignItems="center" justifyItems="center" width="100%">
                            <Box width="100%" textAlign="center">
                                <NorthIcon fontSize="small"/>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box display="flex" className={classes.rotateBox} alignItems="center" justifyItems="center" width="100%">
                            <Box width="100%" textAlign="center">
                                <NorthIcon fontSize="small"/>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83} >
                        <Box display="flex" alignItems="center" justifyItems="center">
                            <Box width="100%" textAlign="center">
                                <NorthIcon fontSize="small"/>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1} >
                        <Box display="flex" paddingRight={1}>
                            <NorthWestIcon fontSize="small"/>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Blank></Blank>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box className={classes.scoreBox}>
                            <Box width="100%" textAlign="center">
                                <Typography variant="h5">{scoreCol(1)?.score}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box className={classes.scoreBox}>
                            <Box width="100%" textAlign="center">
                                <Typography variant="h5">{scoreCol(2)?.score}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box className={classes.scoreBox}>
                            <Box width="100%" textAlign="center">
                                <Typography variant="h5">{scoreCol(3)?.score}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box className={classes.scoreBox}>
                            <Box width="100%" textAlign="center">
                                <Typography variant="h5">{scoreCol(4)?.score}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box className={classes.scoreBox}>
                            <Box width="100%" textAlign="center">
                                <Typography variant="h5">{scoreCol(5)?.score}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Blank></Blank>
                    </Grid>
                    <Grid item xs={1.83}>
                        <Box className={classes.scoreBox}>
                            <Box width="100%" textAlign="center">
                                <Typography variant="h5">{scoreDiag(1)?.score}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Blank></Blank>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5">Total Score:{getScore()}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Blank></Blank>
                    </Grid>
                    
                </Grid>
            </Box>
            <Box 
                display="flex" 
                width={450}
                justifyContent="center"
                alignItems="center"
                padding={3}
            >
                <Button onClick={resetGame} color="success" variant="contained">Restart Game</Button>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Game Over!</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Final Score: {getScore()}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK!</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

function App() {
    
    const [mode, setMode] = useState('dark');
    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });
    const lightTheme = createTheme({
        palette: {
          mode: 'light',
        },
      });

      const handleDarkMode = () => {
        setMode(
            mode === 'light' ? 'dark' : 'light',
        );
    }

    return (
        <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        <Game handleDarkMode={handleDarkMode}/>
      </ThemeProvider>

    )
}
  
  export default App;