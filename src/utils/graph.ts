interface GraphValue {
    value: number
    duration: number
}

interface GraphValueInterval {
    from: number
    to: number
}

export class Graph {
    public values: GraphValue[] = [];
    public currentTime: number = 0;

    public add(value: number, duration: number)
    {
        const val: GraphValue = {
            value: value,
            duration: duration
        }
        this.values.push(val);
    }

    public changeCurrentTimeBy(time: number)
    {
        this.currentTime += time;
        if(this.currentTime > this.getTotalTime()) this.currentTime = this.getTotalTime();
        if(this.currentTime < 0) this.currentTime = 0;
    }

    public getValue()
    {
        //const totalTime = this.getTotalTime();
        const currentTime = this.currentTime;

        let currentValueIndex = 0;

        for(const value of this.values)
        {
            const index = this.values.indexOf(value);

            const interval = this.getValueInterval(index);

            if(currentTime >= interval.from && currentTime <= interval.to)
            {
                currentValueIndex = index
                break;
            }
        }
       
        
        const value = this.values[currentValueIndex];
        const valueInterval = this.getValueInterval(currentValueIndex);
        
        let nextValueIndex = currentValueIndex + 1
        if(nextValueIndex > this.values.length - 1)
        {
            nextValueIndex = this.values.length - 1;
        }

        const nextValue = this.values[nextValueIndex];

        //const nextValueInterval = this.getValueInterval(nextValueIndex);

        //console.log(`${value.value} to ${nextValue.value} for ${value.duration}`);

        const t = (currentTime - valueInterval.from) / (valueInterval.to - valueInterval.from);
        //console.log(t, `${currentTime} / ${valueInterval.to}`);
        
        const result = Phaser.Math.Linear(value.value, nextValue.value, t);

        return result;
    }

    public getValueInterval(index: number)
    {
        const interval: GraphValueInterval = {
            from: 0,
            to: 0
        }

        let startAt = 0;
        for(const value of this.values)
        {
            const i = this.values.indexOf(value);
            const start = startAt;
            const end = start + value.duration;

            if(index == i)
            {
                //console.log(`${index} | ${start} to ${end}`);
             
                interval.from = start;
                interval.to = end;
                break;
            }

            startAt += value.duration;
        }

        return interval;
    }

    public getTotalTime()
    {
        let time = 0;
        for(const value of this.values)
        {
            time += value.duration;
        }
        return time;
    }
}