import React from 'react';
import {TouchableOpacity, StyleSheet, SafeAreaView, Button, Alert} from 'react-native';
import {Audio} from 'expo-av';
import {Ionicons} from '@expo/vector-icons';

//Class to display a button to play an audio
class PlayAudio extends React.Component {

    //Initializing
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            playbackInstance: null,
            volume: 1.0,
            isBuffering: false,
            errorText: '',
            url: this.props.url,
            playedOnce: false
        }
        
    }

    //Initializing
    async componentDidMount() {
        try {
            
            await Audio.setAudioModeAsync({
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROIS_DUCK_OTHERS,
                shouldDuckAndroid: true,
                staysActiveInBackground: true,
                playThroughEarpieceAndroid: true
            })   
        } catch(e){
            this.setState({errorText: 'Error'});
        }
        try{
            this.loadAudio()
        this.setState({errorText: this.state.url})
        }catch(error){
            this.setState({errorText: 'Error'});
        }        
    }

    //Loading the audio to be played from the url
    async loadAudio() {
        const {isPlaying, volume} = this.state

        try {
            const playbackInstance = new Audio.Sound()
            const source = {
                uri: this.props.url
            }

            const status = {
                shouldPlay: isPlaying,
                volume
            }
            playbackInstance.setOnPlaybackStatusUpdate(this.setOnPlaybackStatusUpdate)
            await playbackInstance.loadAsync(source, status, false)
            this.setState({playbackInstance})
        } catch (error) {
            this.setState({errorText: 'Error'})
        }
    }

    onPlayStatusUpdate = status => {
        this.setState({
            isBuffering: status.isBuffering
        })
    }

    //Handle function for the play button
    handlePlay = async () => {
        const {isPlaying,playbackInstance,playedOnce} = this.state
        if (!isPlaying) {
            try{
                await playbackInstance.playAsync();
                this.setState({isPlaying: !isPlaying});
                this.setState({playedOnce: !playedOnce})
            } catch (error) {
                this.setState({errorText: 'error playing'});
            }
        } else if (isPlaying && playedOnce) {
            try{
                await playbackInstance.replayAsync();
            } catch (error) {
                this.setState({errorText: 'error replaying'});
            }
        } 
    }


    render() {
        //Returning the play button component for audio to be played
        return (
            <>
            <TouchableOpacity  onPress={this.handlePlay}>
                <Ionicons name = 'volume-high' size={38} color="#a70be0"/>
            </TouchableOpacity>
            </>
        )
    }
}

export default PlayAudio