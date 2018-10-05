import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import RandomColor from 'randomcolor';
import moment from 'moment';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Icon from '@folio/stripes-components/lib/Icon';
import Button from '@folio/stripes-components/lib/Button';
import ServicePointSelector from './ServicePointSelector';
import CalendarUtils from '../../CalendarUtils';
import ExceptionalBigCalendar from './ExceptionalBigCalendar';
import '!style-loader!css-loader!../../css/exception-form.css'; // eslint-disable-line

class ExceptionWrapper extends React.Component {
    static propTypes = {
      entries: PropTypes.object,
      onClose: PropTypes.func.isRequired,
      stripes: PropTypes.object,
      intl: PropTypes.object
    };

    constructor() {
      super();
      this.setServicePoints = this.setServicePoints.bind(this);
      this.handleServicePointChange = this.handleServicePointChange.bind(this);
      this.setting = this.setting.bind(this);
      this.settingALL = this.settingALL.bind(this);
      this.separateEvents = this.separateEvents.bind(this);
      this.getEvent = this.getEvent.bind(this);
      this.getAllServicePoints = this.getAllServicePoints.bind(this);
      this.setState({
        servicePoints: [],
        events: [{
          id: null,
          startDate: null,
          endDate: null,
        }],
        openingAllPeriods: []
      });
    }

    componentWillMount() {      // eslint-disable-line react/no-deprecated
      const tempServicePoints = [{
        id: null,
        name: null,
        selected: null,
        color: null,
      }];
      const colors = [];
      for (let i = 0; i < this.props.entries.length; i++) {
        colors[i] = RandomColor({
          luminosity: 'random',
          hue: 'random'
        });
      }
      for (let i = 0; i < this.props.entries.length; i++) {
        const tempSP = {
          id: this.props.entries[i].id,
          name: this.props.entries[i].name,
          selected: false,
          color: colors[i],
        };
        tempServicePoints[i] = tempSP;
      }
      this.setting(tempServicePoints);
    }

    componentDidMount() {
      this.getAllServicePoints();
      const tempServicePoints = [{
        id: null,
        name: null,
        selected: null,
        color: null,
      }];
      const colors = [];
      for (let i = 0; i < this.props.entries.length; i++) {
        colors[i] = RandomColor({
          luminosity: 'random',
          hue: 'random'
        });
      }
      for (let i = 0; i < this.props.entries.length; i++) {
        const tempSP = {
          id: this.props.entries[i].id,
          name: this.props.entries[i].name,
          selected: false,
          color: colors[i],
        };
        tempServicePoints[i] = tempSP;
      }
      this.getAllServicePoints();
      this.setting(tempServicePoints);
    }

    setting(sps) {
      const events = [];
      if (events.length === 0) {
        const event = {};
        event.start = null;
        event.end = null;
        event.id = null;
        events.push({ ...event });
      }

      this.setState({
        servicePoints: sps,
        events,
      });
    }

    settingALL(sps) {
      const events = [];
      let k = 0;
      let color = 'black';
      if (this.state.openingAllPeriods !== null && this.state.openingAllPeriods !== undefined) {
        for (let i = 0; i < this.state.openingAllPeriods.length; i++) {
          for (let j = 0; j < sps.length; j++) {
            if (sps[j].id === this.state.openingAllPeriods[i].servicePointId && sps[j].selected === true) {
              const event = {};
              event.start = this.state.openingAllPeriods[i].startDate;
              event.end = this.state.openingAllPeriods[i].endDate;
              event.id = this.state.openingAllPeriods[i].id;
              event.openingDays = this.state.openingAllPeriods[i].openingDays;

              if (this.state.servicePoints) {
                for (let l = 0; l < this.state.servicePoints.length; l++) {
                  if (this.state.servicePoints[l].id === this.state.openingAllPeriods[i].servicePointId) {
                    color = this.state.servicePoints[l].color;
                  }
                }
              }

              event.color = color;
              const sepEvent = this.separateEvents(event);

              for (let g = 0; g < sepEvent.length; g++) {
                events[k] = sepEvent[g];
                k++;
              }
            }
          }
        }
      }

      if (events.length === 0) {
        const event = {};
        event.start = null;
        event.end = null;
        event.id = null;
        events.push({ ...event });
      }

      this.setState({
        servicePoints: sps,
        events,
      });
    }

    setServicePoints(sps) {
      const event = {};
      event.start = null;
      event.end = null;
      event.id = null;


      this.setState({
        servicePoints: sps,
      });
      this.settingALL(sps);
    }

    separateEvents(event) {
      const temp = [];
      let g = 0;
      for (let i = 0; i < moment(event.end).diff(moment(event.start), 'days') + 1; i++) {
        const today = moment(event.start).add(i, 'days').format('dddd').toUpperCase();

        const dates = [];

        for (let j = 0; j < event.openingDays.length; j++) {
          if (today === event.openingDays[j].weekdays.day) {
            if (event.openingDays[j].openingDay.allDay === true) {
              dates.push(
                <div>All day</div>
              );
            }
            for (let k = 0; k < event.openingDays[j].openingDay.openingHour.length; k++) {
              dates.push(
                <div>
                  {event.openingDays[j].openingDay.openingHour[k].startTime}
                  {' '}

-
                  {' '}
                  {event.openingDays[j].openingDay.openingHour[k].endTime}
                </div>
              );
              if (event.openingDays[j].openingDay.openingHour.length > 1 && event.openingDays[j].openingDay.openingHour.length > dates.length) {
                dates.push(
                  <div>,</div>
                );
              }
            }
          }
          const eventContent = <div className="rbc-event-dates-content">{dates}</div>;
          const eventTitle =
            <div className="rbc-event-dates" style={{ backgroundColor: event.color }}>
              {' '}
              {eventContent}
            </div>;

          const tempObj = {
            id: event.id,
            end: moment(event.start).add(i, 'days'),
            start: moment(event.start).add(i, 'days'),
            title: eventTitle,

          };
          temp[g] = tempObj;
        }
        g++;
      }
      return temp;
    }

    handleServicePointChange(sp) {
      const tempServicePoints = this.state.servicePoints;
      for (let i = 0; i < tempServicePoints.length; i++) {
        if (tempServicePoints[i].id === sp.id) {
          tempServicePoints.selected = sp.selected;
        }
      }
      this.setServicePoints(tempServicePoints);
    }

    getEvent(event) {
      // TODO visszaadni az exceptioneleket + exceptional értéket hozzáadni az eventhez
      console.log(event);
    }

    getAllServicePoints() {
      const promises = [];

      for (let i = 0; i < this.props.entries.length; i++) {
        this.props.parentMutator.query.replace(this.props.entries[i].id);
        const a = this.props.parentMutator.periods.GET();
        promises.push(a);
      }

      let k = 0;
      const allSP = [];
      Promise.all(promises).then((openingAllPeriods) => {
        for (let i = 0; i < openingAllPeriods.length; i++) {
          const temp = openingAllPeriods[i];
          for (let j = 0; j < temp.length; j++) {
            const tempSP = {
              startDate: temp[j].startDate,
              endDate: temp[j].endDate,
              id: temp[j].id,
              name: temp[j].name,
              openingDays: temp[j].openingDays,
              servicePointId: temp[j].servicePointId
            };
            allSP[k] = tempSP;
            k++;
          }
        }
        this.setState({
          openingAllPeriods: allSP
        });
      });
    }


    render() {
      const paneStartMenu = <PaneMenu><IconButton icon="closeX" onClick={this.props.onClose} /></PaneMenu>;
      const paneLastMenu = <PaneMenu><Button buttonStyle="primary">{CalendarUtils.translateToString('ui-calendar.exceptionalNewPeriod', this.props.stripes.intl)}</Button></PaneMenu>;
      const paneTitle =
        <PaneMenu>
          <Icon icon="calendar" />
          {CalendarUtils.translateToString('ui-calendar.settings.library_hours', this.props.stripes.intl)}
        </PaneMenu>;

      return (
        <Paneset>
          <Pane defaultWidth="20%" paneTitle={CalendarUtils.translateToString('ui-calendar.servicePoints', this.props.stripes.intl)}>
            <ServicePointSelector
              {...this.props}
              handleServicePointChange={this.handleServicePointChange}
              setServicePoints={this.setServicePoints}
              servicePoints={this.state.servicePoints}
            />
          </Pane>
          <Pane defaultWidth="fill" paneTitle={paneTitle} firstMenu={paneStartMenu} lastMenu={paneLastMenu}>
            <ExceptionalBigCalendar
              {...this.props}
              myEvents={this.state.events}
              getEvent={this.getEvent}
            />
          </Pane>
        </Paneset>
      );
    }
}

export default ExceptionWrapper;
