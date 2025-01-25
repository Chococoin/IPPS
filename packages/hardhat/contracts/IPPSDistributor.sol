// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IPPSDistributor {
    address public owner;
    uint256 public constant WITHDRAW_THRESHOLD = 8 ether; // Minimum balance required to distribute funds
    uint256 public constant MAX_PAYOUT = 43690 ether; // Maximum payout per participant

    // Mappings and lists to manage the system
    mapping(address => bool) public hasDeposited; // Tracks if an address has already deposited
    mapping(address => address) public bridgers; // Maps each participant to their bridger
    mapping(address => uint256) public payouts; // Total amount paid out to each participant
    mapping(uint256 => address) public pub; // FIFO queue for the pub based on a mapping
    uint256 public pubStart = 0; // Index of the first participant in the pub
    uint256 public pubEnd = 0;   // Index of the next available space in the pub
    address public docker; // Current participant in the docker
    address[] public bridges; // List of bridges assigned to the current docker
    uint256 public participantCount; // Counter for the total number of participants

    // Event to log deposits
    event Deposit(address indexed sender, uint256 amount);

    // Event to log withdrawals
    event Withdraw(address indexed recipient, uint256 amount);

    // Constructor: Initializes the contract and sets the owner as the first participant in the docker
    constructor() payable {
        require(msg.value == 1 ether, "Owner must deposit 1 ether during deployment");

        owner = msg.sender; // The owner of the contract
        docker = msg.sender; // The owner becomes the first participant in the docker
        hasDeposited[msg.sender] = true;
        participantCount = 1;

        emit Deposit(msg.sender, msg.value);
    }

    // Function to receive deposits
    receive() external payable {
        require(msg.value == 1 ether, "Deposit must be exactly 1 unit of the native currency");
        require(!hasDeposited[msg.sender], "Sender has already deposited");

        hasDeposited[msg.sender] = true;
        participantCount++;

        if (docker == address(0)) {
            docker = msg.sender; // If the docker is empty, the depositor becomes the docker
        } else if (bridges.length < 4) {
            // If there is space in the bridges, add the user directly
            bridges.push(msg.sender);
            bridgers[msg.sender] = docker; // Assign the current docker as the bridger

            // If the docker already has 4 bridges, transition to the next cycle
            if (bridges.length == 4) {
                completeDockerCycle();
            }
        } else {
            // Add to the pub if there is no space in the bridges
            addToPub(msg.sender);
        }

        emit Deposit(msg.sender, msg.value);

        // Attempt to distribute funds if conditions are met
        if (address(this).balance >= WITHDRAW_THRESHOLD) {
            distribute();
        }
    }

    // Complete the cycle for the current docker
    function completeDockerCycle() internal {
        // Current docker moves to sailing
        docker = address(0);

        // First bridge becomes the new docker
        docker = bridges[0];

        // The other bridges move to the pub
        for (uint256 i = 1; i < bridges.length; i++) {
            addToPub(bridges[i]);
        }

        // Clear the bridges
        delete bridges;

        // Promote the first participant in the pub to docker, if available
        if (pubStart < pubEnd) {
            promoteFromPub();
        }
    }

    // Promote the next participant from the pub to the docker
    function promoteFromPub() internal {
        require(pubStart < pubEnd, "Pub is empty");
        docker = removeFromPub();
    }

    // Add a participant to the pub
    function addToPub(address participant) internal {
        pub[pubEnd] = participant;
        pubEnd++;
    }

    // Remove the first participant from the pub
    function removeFromPub() internal returns (address) {
        require(pubStart < pubEnd, "Pub is empty");
        address participant = pub[pubStart];
        delete pub[pubStart];
        pubStart++;
        return participant;
    }

    // Get the current size of the pub
    function getPubSize() public view returns (uint256) {
        return pubEnd - pubStart;
    }

    // Distribute funds to participants
    function distribute() internal {
        uint256 balance = address(this).balance;
        require(balance >= WITHDRAW_THRESHOLD, "Balance is below the withdraw threshold");

        uint256 parts = 8; // Always divide into 8 parts
        uint256 amountPerPart = balance / parts;

        address current = docker;
        uint256 generationsPaid = 0;

        while (current != address(0) && generationsPaid < 8) {
            if (payouts[current] < MAX_PAYOUT) {
                uint256 payment = amountPerPart;

                if (payouts[current] + payment > MAX_PAYOUT) {
                    payment = MAX_PAYOUT - payouts[current];
                }

                (bool success, ) = current.call{value: payment}("");
                require(success, "Transfer failed");

                payouts[current] += payment;
                emit Withdraw(current, payment);
            }

            current = bridgers[current]; // Move to the previous bridger
            generationsPaid++;
        }
    }

    // Get the current balance of the contract
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
