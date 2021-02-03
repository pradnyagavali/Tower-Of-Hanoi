new Vue({
  el: '#app',
  data: {
    title: 'Choose Disks',
    completion_text: 'Congratulations!',
    warning_text: '',
    disk_order_error_text: 'Cannot put the disk on top of smaller one.',
    disks: [
      { disk_num: 1, position: 'left', pre_position: 'left' },
      { disk_num: 2, position: 'left', pre_position: 'left' },
      { disk_num: 3, position: 'left', pre_position: 'left' },
      { disk_num: 4, position: 'left', pre_position: 'left' },
      { disk_num: 5, position: 'left', pre_position: 'left' },
      { disk_num: 6, position: 'left', pre_position: 'left' },
      { disk_num: 7, position: 'left', pre_position: 'left' },
      { disk_num: 8, position: 'left', pre_position: 'left' },
      { disk_num: 9, position: 'left', pre_position: 'left' }
    ],
    disk_count: 2,
    disk_count_options: [
      { text: '1', value: 1},
      { text: '2', value: 2},
      { text: '3', value: 3},
      { text: '4', value: 4},
      { text: '5', value: 5},
      { text: '6', value: 6},
      { text: '7', value: 7},
      { text: '8', value: 8},
      { text: '9', value: 9},
    ],
    movement_count: 0,
    lifted_disk_num: 0,
    started: false,
    warned: false,
    completed: false
  },
  computed: {
    lifted_disk: function() {
      if (this.lifted_disk_num === 0) return
      return this.disks[this.lifted_disk_num - 1]
    },
    shortest_movement_count: function () {
      return 2 ** this.disk_count - 1
    },
    is_count_over: function () {
      return this.movement_count > this.shortest_movement_count
    }
  },
  methods: {
    diskClasses: function (disk_num, position) {
      return {
        [`disk${disk_num}`]: true,
        'lifted-disk': this.lifted_disk_num === disk_num,
        'hidden-disk':
          (this.disk_count < disk_num) || (this.disk(disk_num).position !== position)
      }
    },
    disk: function (disk_num) {
      return this.disks[disk_num - 1]
    },
    resetGame: function () {
      this.started = false
      this.completed = false
      this.movement_count = 0
      this.lifted_disk_num = 0
      for (let disk of this.disks) {
        disk.position = 'left'
        disk.pre_position = 'left'
      }
    },
    onClickHandler: function (position) {
      if (this.completed) return
      
      if (this.lifted_disk_num === 0) {
        // No disk is lifted
        for (let disk of this.disks) {
          if (disk.position === position) {
            this.lifted_disk_num = disk.disk_num
            break
          }
        }
      } else {
        // The disk is lifted
        this.started = true
        
        let min_disk = 0
        for (let disk of this.disks) {
          if (disk.position === position) {
            min_disk = disk.disk_num
            break
          }
        }
        if (min_disk < this.lifted_disk_num) {
          this.warned = true
          this.warning_text = this.disk_order_error_text
          return
        }
        
        
        if (this.lifted_disk.position === this.lifted_disk.pre_position) {
          this.movement_count--
        }
        this.lifted_disk.pre_position = position
        this.lifted_disk_num = 0
        this.warned = false
        this.checkComplition()
      }
    },
    onMouseEnterHandler: function (position) {
      if (this.completed) { return }
      if (this.lifted_disk_num === 0) return
      
      this.lifted_disk.position = position
    },
    checkComplition: function () {
      this.completed = this.disks.slice(0, this.disk_count).every(function (disk) {
        return disk.position === 'right'
      })
    }
  },
  watch: {
    lifted_disk_num: function(val, oldVal) {
      if (val === 0) this.movement_count++
    }
  }
})